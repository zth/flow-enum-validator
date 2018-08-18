# flow-enum-validator

A very small and simple library to help validate unknown strings to enums with Flow.

## Installation

```
yarn add flow-enum-validator
```

## Usage

The main use for this library is mapping unknown strings to allowed values from an enum in a type safe way using Flow.
Check the examples out below.

### Basic example

```javascript
import { createEnumValidator, validateEnum } from 'flow-enum-validator';

// The enum strings are derived from the _keys_ of the provided object.
const myEnumObj = Object.freeze({
  // Remember to freeze the provided object so Flow knows it cannot change
  FIRST_ENUM_VALUE: null, // Values can be anything, the validator only looks at the keys
  SECOND_ENUM_VALUE: null
});

const validateString = createEnumValidator(myEnumObj);
// You can create a validator function for easy reuse.
// This returns a function with the signature (checkThisValue: string) => ?$Keys<typeof myEnumObj>
// In this specific case, it means that all function calls below return the type 'FIRST_ENUM_VALUE' | 'SECOND_ENUM_VALUE' | null | void

validateString('SOME_VALUE_TO_VALIDATE_HERE');
// This would return void

validateString('FIRST_ENUM_VALUE');
// This would return FIRST_ENUM_VALUE

validateEnum(myEnumObj, 'FIRST_ENUM_VALUE');
// You can also use validateEnum directly with an enum object and value if you don't want a validator function.
// This would return FIRST_ENUM_VALUE
```

### Mapping an unknown input to an enum value in a type safe way (in React, but not React specific)

```javascript
import { createEnumValidator } from 'flow-enum-validator';

const ALLOWED_KEYS = Object.freeze({
  A: null,
  B: null,
  C: null
});

type AllowedKeysType = $Keys<typeof ALLOWED_KEYS>; // 'A' | 'B' | 'C';

const keyValidator = createEnumValidator(ALLOWED_KEYS);

...

type State = {
  pressedKey: AllowedKeysType
}

// Handling input from a <input type="text" onChange={this.handleInputChange} value={this.state.pressedKey} />
handleInputChange = (event: SyntheticEvent<HTMLInputElement>) => {
  const key = keyValidator(event.currentTarget.value); // Variable key is now 'A' | 'B' | 'C' | null | void

  if (key) {
    // key is now 'A' | 'B' | 'C'
    this.setState({
      pressedKey: key // This type checks fine as we've refined our type enough for Flow to know that the possible values match the definition in type State
    })
  }
}
```

### Longer, contrived example and explanation

```javascript
import { createEnumValidator } from 'flow-enum-validator';

const myEnumObj = Object.freeze({
  FIRST_ENUM_VALUE: null,
  SECOND_ENUM_VALUE: null,
  THIRD_ENUM_VALUE: null
});

const validateString = createEnumValidator(myEnumObj);

// Here, we take Flow all the way down to a single possible value through a series of type refinements

const someRandomString = getSomeRandomString();
// Flow naturally has no clue what this is before the function is actually run in your program,
// but imagine it returns 'FIRST_ENUM_VALUE' in this example. Lets follow Flow!

const validatedVal = validateString(someRandomString);
// 'FIRST_ENUM_VALUE' | 'SECOND_ENUM_VALUE' | 'THIRD_ENUM_VALUE' | null | void

if (validatedVal) {
  // 'FIRST_ENUM_VALUE' | 'SECOND_ENUM_VALUE' | 'THIRD_ENUM_VALUE'

  if (validatedVal !== 'SECOND_ENUM_VALUE') {
    // 'FIRST_ENUM_VALUE' | 'THIRD_ENUM_VALUE'
    if (validatedVal !== 'THIRD_ENUM_VALUE') {
      // 'FIRST_ENUM_VALUE' is the only possible value left, and Flow understands that. Therefore, this generates no Flow errors:
      (validatedVal: 'FIRST_ENUM_VALUE');
    }
  }
}
```
