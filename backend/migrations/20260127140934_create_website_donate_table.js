/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('website_donate', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('subtitle').nullable();
    table.text('description').nullable();
    table.json('local_bank_details').nullable();
    table.json('fcra_bank_details').nullable();
    table.string('qr_code_url').nullable();
    table.timestamps(true, true);
  }).then(() => {
    return knex('website_donate').insert({
      title: 'Support Our Mission',
      subtitle: 'Make a Difference',
      description: 'Your contribution directly empowers marginalized communities through education, health, and sustainable development.',
      local_bank_details: JSON.stringify({
        accountName: "HELP TO SELF HELP TRUST",
        accountNumber: "333202010026005",
        bankName: "Union Bank of India",
        branch: "Chetpet Branch",
        address: "Thiruvannamalai District, Tamilnadu, India - 606801",
        ifscCode: "UBIN0533327",
        swiftCode: "UBININBBOMD"
      }),
      fcra_bank_details: JSON.stringify({
        accountName: "HELP TO SELF HELP TRUST",
        accountNumber: "40089867290",
        bankName: "State Bank of India",
        branch: "New Delhi Main Branch (Code: 00691)",
        address: "FCRA Cell, 4th Floor, 11 Sansad Marg, New Delhi - 110001",
        ifscCode: "SBIN0000691",
        swiftCode: "SBININBB104"
      })
    });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('website_donate');
};
