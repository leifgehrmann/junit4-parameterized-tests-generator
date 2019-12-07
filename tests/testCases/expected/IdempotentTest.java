package com.leifgehrmann.stepcounter;

import org.junit.Test;
import org.junit.Assert;

public class IdempotentTest {
    //> Zero(0, "0 steps")
    //> Singular(1, "1 step")
    @ParameterizedTest
    public void testFormat(double numberOfSteps, String expected) {
        Assert.assertEquals(expected, StepUnitFormatter().format(numberOfSteps));
    }

    @Test
    public void testSetUnit() {
        String result = StepUnitFormatter().round(false).format(3.3);
        Assert.assertEquals("3.3 steps", result);
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
}
