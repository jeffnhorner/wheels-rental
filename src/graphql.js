import gql from "graphql-tag";

export const GET_AVAILABLE_PLANS = gql`
  query GetAvailablePlans($zip_code: String!) {
    plans(
      where: {
        availability_zones_plans: {
          availability_zone: { zip_code: { _eq: $zip_code } }
        }
      }
      order_by: { amount_cents: desc }
    ) {
      amount_cents
      day_rate_cents
      is_best_value
      is_most_popular
      type
      description
      name
      id
      term
    }
  }
`;
