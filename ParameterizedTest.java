package x.x.x;

import org.junit.Test;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
public @interface ParameterizedTest {
    Class<? extends Throwable> expected() default Test.None.class;
}
