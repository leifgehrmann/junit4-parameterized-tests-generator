package com.leifgehrmann.stepcounter;

import org.junit.Test;
import org.junit.Assert;

public class StepUnitFormatterTests {
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

    @Test
    public void testSetUnit() {
        String result = StepUnitFormatter().round(false).format(3.3);
        Assert.assertEquals("3.3 steps", result);
    }

    //> Null(null)
    //> Integer(Integer.decode("BLA"))
    @ParameterizedTest(expected = NullPointerException.class)
    public void testFormat(Object numberOfSteps) {
        StepUnitFormatter().format(numberOfSteps);
    }

    // DO NOT EDIT BELOW THIS LINE

    @Test
    public void testFormatZero() {
        testFormat(0, "0 steps");
    }

    @Test
    public void testFormatSingular() {
        testFormat(1, "1 step");
    }

    @Test
    public void testFormatPlural() {
        testFormat(2, "2 steps");
    }

    @Test
    public void testFormat999() {
        testFormat(999, "999 steps");
    }

    @Test
    public void testFormatThousand() {
        testFormat(1000, "1,000 steps");
    }

    @Test
    public void testFormatMillion() {
        testFormat(1000000, "1,000,000 steps");
    }

    @Test
    public void testFormatDecimal() {
        testFormat(3.3, "3 steps");
    }

    @Test
    public void testFormatNegative() {
        testFormat(-5, "0 steps");
    }

    @Test(expected = NullPointerException.class)
    public void testFormatNull() {
        testFormat(null);
    }

    @Test(expected = NullPointerException.class)
    public void testFormatInteger() {
        testFormat(Integer.decode("BLA"));
    }
}
