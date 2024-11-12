# Age Verification Strategy

The problem to solve here is to protect user privacy while also not repeatedly prompting the user to verify their age. The website asks users to confirm if they are over 18 as a part of account creation. If they are not 18, we temporarily store a hashed birth month and year until they turn 18, at which point we mark the user as age verified and remove the hashed value.

**ADULT_AGE_VERIFIED**: This is a boolean flag that determines access to 18+ content.

**Eventual Automatic Access**: Granting access on their birthday is not necessary, just eventually. On the first day of each month, we check if users with a stored birth month and year combo have turned 18 in the previous month, and if so, update their status so "ADULT_AGE_VERIFIED" is true, and remove their age information.  Their specific date of birth is never stored in the first place.