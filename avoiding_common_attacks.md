# Integer Overflow and Underflow

The contract uses SafeMath Library from Open Zeppelin to prevent integer overflow and underflow when depositing and withdrawing amounts.

# Denial of Service 

In order to prevent a Denial of service, the contract uses the Pull over Push Payments so in case of an attack only the attacker gets denied.
