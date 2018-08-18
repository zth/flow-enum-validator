// @flow
import { createEnumValidator } from '../index';

function funcThatTakesExtendedEnum(
  input: 'FIRST_STRING' | 'SECOND_STRING' | 'THIRD_STRING' | 'ANOTHER_VALUE'
) {
  return input;
}

function funcThatTakesLessValues(input: 'FIRST_STRING' | 'SECOND_STRING') {
  return input;
}

const simpleStringValidator = createEnumValidator(
  Object.freeze({
    FIRST_STRING: null,
    SECOND_STRING: null,
    THIRD_STRING: null
  })
);

const basicValidatedValue = simpleStringValidator('SOME_OTHER_VALUE');

('FIRST_STRING': typeof basicValidatedValue);
('SECOND_STRING': typeof basicValidatedValue);
('THIRD_STRING': typeof basicValidatedValue);

// $ExpectError - This should fail as value is not included in enum object
('FOURTH_STRING': typeof basicValidatedValue);

if (basicValidatedValue != null) {
  (basicValidatedValue: 'FIRST_STRING' | 'SECOND_STRING' | 'THIRD_STRING');

  funcThatTakesExtendedEnum(basicValidatedValue);

  // $ExpectError - Our enum has more values than the input allows
  funcThatTakesLessValues(basicValidatedValue);

  if (basicValidatedValue !== 'THIRD_STRING') {
    // Type refinement should work here
    funcThatTakesLessValues(basicValidatedValue);
  }

  // $ExpectError - This should also fail even though we called the checker with the value, as it should never
  (basicValidatedValue: 'SOME_OTHER_VALUE');
}

if (basicValidatedValue == null) {
  // If value is not truthy, it must be void
  (basicValidatedValue: void | null);

  // $ExpectError - Type should be refined to void here
  (basicValidatedValue: 'FIRST_STRING' | 'SECOND_STRING' | 'THIRD_STRING');
}

/**
 * OBJECT SPREAD
 */

const Type1 = {
  ONE: null,
  TWO: null
};

const Type2 = {
  THREE: null,
  FOUR: null
};

const CompositeType = {
  ...Type1,
  ...Type2,
  FIVE: null
};

const compositeTypeValidator = createEnumValidator(CompositeType);
const validated = compositeTypeValidator('FIVE');

// These are present in the object and should be fine
('TWO': typeof validated);
('FIVE': typeof validated);

/// $ExpectError - This should error as SIX is not present in the object used for the validation
('SIX': typeof validated);
