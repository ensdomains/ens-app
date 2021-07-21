const typePolicies = {
  typePolicies: {
    Query: {
      fields: {
        cartItems: {
          read() {
            return 1
          }
        }
      }
    }
  }
}

export default typePolicies
