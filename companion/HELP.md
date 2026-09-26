# companion-module-avolites-titan

## Module for Avolites Titan software and desks

This module controls Avolites Titan software, running on computers or lighting desks.

The module works for Titan version 14.0 and onwards. It will probably also works for older versions but with reduced functionality.

## Cue numbers from variables

In **Cuelist set next cue**, the **Cue number** field accepts a number or a Companion variable, such as `$(custom:next_cue)`. You can also insert a local variable using Companion's variable picker. Variables are resolved each time the action runs and must produce a number from 1 to 9999. Invalid values are logged and neither select nor fire a cue. Existing buttons keep their saved cue numbers.

---

**WARNING**  
This module does NOT work with the Titan One, T1 and Editor Keys.
The modules communicates with Titan using the WebAPI which is enabled with T2 dongles and beyond (T3, desks...).
