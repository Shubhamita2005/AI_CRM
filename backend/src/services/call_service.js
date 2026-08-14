const pool = require("../config/database");

const getCustomerPhone = async (customerId) => {
  const result = await pool.query(
    `
    SELECT 
      customer_id,
      first_name,
      last_name,
      company_name,
      phone_number
    FROM customers
    WHERE customer_id = $1
    `,
    [customerId]
  );

  if (result.rows.length === 0) {
    throw new Error("Customer not found.");
  }

  const customer = result.rows[0];

  if (!customer.phone_number) {
    throw new Error("Customer phone number not found.");
  }

  console.log("✅ Phone number found:", customer.phone_number);

  return {
    customer_id: customer.customer_id,
    name: `${customer.first_name} ${customer.last_name}`,
    company_name: customer.company_name,
    phone_number: customer.phone_number
  };
};

module.exports = {
  getCustomerPhone
};