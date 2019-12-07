const fs = require('fs');
const path = require('path');

/**
 * Returns an array of files (absolute path) matching a file extension in a
 * directory.
 *
 * @param {string} directory
 * @param {string} extension
 *
 * @returns {string[]}
 */
function getFilesWithExtension(directory, extension) {
  const matchedFiles = [];

  if (!fs.existsSync(directory)) {
    throw new Error(`Directory "${directory}" does not exist`);
  }

  const files = fs.readdirSync(directory);
  for (let i = 0; i < files.length; i += 1) {
    const filename = path.join(directory, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      // Recurse
      const nestedMatchedFiles = getFilesWithExtension(filename, extension);
      matchedFiles.push(...nestedMatchedFiles);
    } else if (filename.endsWith(extension)) {
      matchedFiles.push(filename);
    }
  }

  return matchedFiles;
}

/**
 * @param {string} line
 *
 * @returns {null|{testCaseName: string, testCaseArguments: string}}
 */
function parseParameterizedTestCase(line) {
  const regex = /^\s*\/\/>\s*(\w*)(.*)\s*$/m;
  const matches = regex.exec(line);
  if (matches === null) {
    return null;
  }
  return {
    testCaseName: matches[1],
    testCaseArguments: matches[2],
  };
}

/**
 * @param {string} line
 *
 * @returns {null|string}
 */
function parseParameterizedTestAnnotation(line) {
  const regex = /^\s*@ParameterizedTest(.*)$/m;
  const matches = regex.exec(line);
  if (matches === null) {
    return null;
  }
  return matches[1];
}

/**
 * @param {string} line
 *
 * @returns {null|string}
 */
function parseTestFunction(line) {
  const regex = /^\s*public\s*void\s*([a-zA-Z0-9_]*)(.*)$/m;
  const matches = regex.exec(line);
  if (matches === null) {
    return null;
  }
  return matches[1];
}

/**
 * @param {string} testName
 * @param {string} testAnnotation
 * @param {{testCaseName: string, testCaseArguments: string}[]} testCases
 *
 * @returns {string[]}
 */
function generateTestsForParameterizedTest(testName, testAnnotation, testCases) {
  return testCases.map((testCase) => `
    @Test${testAnnotation}
    public void ${testName + testCase.testCaseName}() {
        ${testName + testCase.testCaseArguments};
    }`);
}

/**
 * @param {string} filepath
 */
function processFile(filepath) {
  const dividingLine = '\n    // DO NOT EDIT BELOW THIS LINE\n';
  const generatedTests = [];

  // Keep track of various tokens while processing the file
  let parameterizedTestCases = [];
  let parameterizedTestAnnotation = null;

  // Read contents of the file
  const fileContent = fs.readFileSync(filepath, 'UTF-8');
  const lines = fileContent.split(/\r?\n/);

  // For each line in the file
  lines.forEach((line) => {
    // Find parameterized test cases
    const parsedParameterizedTestCase = parseParameterizedTestCase(line);
    if (parsedParameterizedTestCase !== null) {
      parameterizedTestCases.push(parsedParameterizedTestCase);
      return;
    }

    // Find parameterized test annotations, which may include "expected=..."
    // attributes
    const parsedParameterizedTestAnnotation = parseParameterizedTestAnnotation(
      line,
    );
    if (parsedParameterizedTestAnnotation !== null) {
      parameterizedTestAnnotation = parsedParameterizedTestAnnotation;
      return;
    }

    // Find the parameterized test name
    const parsedParameterizedTestName = parseTestFunction(line);
    if (parsedParameterizedTestName !== null) {
      if (
        parameterizedTestCases.length > 0
        && parameterizedTestAnnotation !== null
      ) {
        generatedTests.push(
          ...generateTestsForParameterizedTest(
            parsedParameterizedTestName,
            parameterizedTestAnnotation,
            parameterizedTestCases,
          ),
        );
      }
      parameterizedTestCases = [];
      parameterizedTestAnnotation = null;
    }
  });

  // If no parameterized tests were found, do not change anything
  if (generatedTests.length === 0) {
    return;
  }

  // Determine where to append the generated tests
  let newFileContent;
  const dividingLinePosition = fileContent.indexOf(dividingLine);
  if (dividingLinePosition === -1) {
    // Find the last '}' at the end of the file
    newFileContent = fileContent.replace(/\s*}\s*$/g, '\n');
  } else {
    // Find the dividing line position
    newFileContent = fileContent.substring(0, dividingLinePosition);
  }

  // Append generated tests to end of file
  newFileContent += dividingLine;
  newFileContent += generatedTests.join('\n');
  newFileContent += '\n}\n';
  fs.writeFileSync(filepath, newFileContent);
}

const testDir = `${process.cwd()}/${process.argv[2]}`;
getFilesWithExtension(testDir, '.java').forEach((filepath) => {
  processFile(filepath);
});
