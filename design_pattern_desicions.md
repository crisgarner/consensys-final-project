# Fail early and fail loud

The contract implements fail early and fail loud in order to revert on any action not desired.

# Restricting Access

The contract implements some functions that only the admin is able to use, for example killing or pausing the contract.

# Mortal

The contract can selfdestruct in case it gets hacked to stop functionality.

# Pull over Push Payments

In order to prevent a Denial of service, the contract uses the Pull over Push Payments so in case of an attack only the attacker gets denied.

# Circuit Breaker

Adding information to the contract can be paused implementing a circuit breaker.