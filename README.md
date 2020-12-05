# junit4-parameterized-tests-generator

[![Build Status](https://github.com/leifgehrmann/junit4-parameterized-tests-generator/workflows/Tests/badge.svg?branch=master)](https://github.com/leifgehrmann/junit4-parameterized-tests-generator/actions)
[![Code Coverage](https://codecov.io/gh/leifgehrmann/junit4-parameterized-tests-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/leifgehrmann/junit4-parameterized-tests-generator)

**This project is no longer maintained. Feel free to fork. If it is useful to anyone, let me know!**

Script to generate parameterized JUnit-4 tests for test runners that do not
support parameterized tests.

## Purpose

JUnit-4 has a design flaw where [test runners] cannot be combined to perform
multiple behaviors. For example, JUnit's [`Parameterized`] test runner cannot
be combined with [`RobolectricTestRunner`], or any other test runner because
only one `@RunWith` annotation is permitted per class.

[test runners]: https://github.com/junit-team/junit4/wiki/Test-runners
[`Parameterized`]: https://github.com/junit-team/junit4/wiki/Parameterized-tests
[`RobolectricTestRunner`]: http://robolectric.org

`generateParameterizedTests.js` solves this by parsing special comments in the
test...

```java
class StepUnitFormatterTests {
    //> Zero(0, "0 steps")
    //> Singular(1, "1 step")
    //> Plural(2, "2 steps")
    //> 999(999, "999 steps")
    //> Thousand(1000, "1,000 steps")
    //> Million(1000000, "1,000,000 steps")
    //> Decimal(3.3, "3 steps")
    //> Negative(-5, "0 steps")
    @ParameterizedTest
    public void testFormat(double numberOfSteps, String expected) {
        Assert.assertEquals(expected, StepUnitFormatter().format(numberOfSteps));
    }
}
```

...and converting them to individual tests, which get appended to the end of
the file like this:

```java
    // DO NOT EDIT BELOW THIS LINE 

    @Test
    public void testFormatZero() {
        testFormat(0, "0 steps")
    }

    @Test
    public void testFormatSingular() {
        testFormat(1, "1 step")
    }
    
    @Test
    public void testFormatPlural() {
        testFormat(2, "2 steps")
    }
    
    // Etc.
}
```

## Installation

1. Copy `generateParameterizedTests.js` anywhere into your Java project.
2. Copy `ParameterizedTest.java` into your test source code folder.
3. Update `package x.x.x;` in `ParameterizedTest.java` to reflect your
   project's package structure.

## Running

Node must be installed, but `npm install` is not required. To generate the
parameterized tests, run the following:

```shell script
$ node generateParameterizedTests.js path/to/tests 
```

### Running automatically using Gradle

To avoid having to run the generator manually, a task can be added to your
`build.gradle` file to run the script on `preBuild`, or any other preferred
Gradle task.

```gradle
task generateParameterizedTests(type: Exec) {
    executable "sh"
    args "-c", "node scripts/generateParameterizedTests.js src/test"
}

preBuild.dependsOn generateParameterizedTests
```  

## Attribution

This code is dedicated to the public domain, so no attribution is needed.

This script is based on [a similar implementation by Elliot Chance for
generating parameterized tests in Swift](
https://medium.com/@elliotchance/parameterized-data-driven-tests-in-swift-3b9a46891801).
