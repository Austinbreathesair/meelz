# Updating Mock Data Prices to ZAR

The mock data in `mock-data-test-user.sql` currently has prices in USD. To convert to South African Rands (ZAR):

## Conversion Rate
1 USD ≈ 18 ZAR (adjust based on current rates)

## Current Prices (USD) → New Prices (ZAR)

- Chicken Breast: $0.012/g → R0.22/g (R220/kg)
- Milk: $0.0025/ml → R0.045/ml (R45/L)
- Eggs: $0.40 each → R7 each
- Tomatoes: $0.80 each → R14 each
- Onions: $0.30 each → R5 each
- Rice: $0.003/g → R0.054/g (R54/kg)
- Pasta: $0.004/g → R0.072/g (R72/kg)
- Olive Oil: $0.012/ml → R0.22/ml (R220/L)
- Ground Beef: $0.015/g → R0.27/g (R270/kg)
- Salmon: $0.025/g → R0.45/g (R450/kg)
- Butter: $0.016/g → R0.29/g (R290/kg)
- Cheese: $0.018/g → R0.32/g (R320/kg)
- Bell Peppers: $1.20 each → R22 each

## Note on Existing User Data

The app now displays currency as "R" (Rands). Any new items added through the pantry UI will use whatever unit_price the user enters. The mock data script is primarily for testing and demo purposes.

## Important

Users entering their own pantry items should enter prices in Rands directly. The app doesn't do any currency conversion - it just displays amounts with the "R" symbol.

