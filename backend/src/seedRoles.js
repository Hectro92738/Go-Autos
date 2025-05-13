const Role = require('./models/role');

const seedRoles = async () => {
  try {
    console.log("Conexión ya establecida");

    const roles = ['admin', 'cliente'];

    for (const name of roles) {
      const exists = await Role.findOne({ name });
      if (!exists) {
        await Role.create({ name });
        console.log(`Rol "${name}" creado`);
      } else {
        console.log(`Rol "${name}" ya existe`);
      }
    }
  } catch (err) {
    console.error('Error al sembrar roles:', err);
  }
};

module.exports = seedRoles;
