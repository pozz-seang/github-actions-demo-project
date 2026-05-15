const { connectToDatabase } = require("../core/db_connection");
const db_connection = connectToDatabase();

const createUser = async (code = "", idTg = "", name = "") => {
  try {
    const user = await findUser(idTg);
    if (user.id) return { error: "This account is already in use." };

    const [result] = await db_connection
      .promise()
      .query("INSERT INTO users (code, name, role, idTg) VALUES (?, ?, ?, ?)", [
        code,
        name,
        "user",
        idTg,
      ]);
    if (!result.insertId) return { error: "Failed to create user." };
    return await findUser(idTg);
  } catch (err) {
    return { error: "Database error occurred." };
  }
};

const updateUser = async (code = "", idTg, newName) => {
  try {
    const user = await findUser(idTg);
    if (user.error) return { error: "User not found. Unable to update." };
    const [result] = await db_connection.promise().query( "UPDATE users SET name = ?, code = ? WHERE idTg = ?", [newName, code, idTg] );

    return result.affectedRows ? { message: "User updated successfully!", user: await findUser(idTg) } : { error: "Update failed. No changes were made." };
  } catch {
    return { error: "Database error occurred." };
  }
};

const deleteUser = async (idTg) => {
  try {
    const [result] = await db_connection.promise().query("DELETE FROM users WHERE idTg = ?", [idTg]);
    if (result.affectedRows === 0) return { error: "Your account ID is not available or does not exist." };
    return { message: "User deleted successfully!" };
  } catch (err) {
    console.error("Database error:", err);
    return { error: "Database error occurred." };
  }
};

const findUser = async (idTg) => {
  try {
    const [data] = await db_connection
      .promise()
      .query("SELECT * FROM users WHERE idTg = ?", [idTg]);
    if (data.length === 0)
      return { error: "Your account ID is not available." };
    return data[0];
  } catch (err) {
    return { error: "Database error occurred." };
  }
};


module.exports = {
  findUser,
  updateUser,
  deleteUser,
  createUser,
};
