from db import get_connection
import bcrypt

conn=get_connection()
cursor = conn.cursor(dictionary=True)
admin_password=bcrypt.hashpw("admin".encode("utf-8"), bcrypt.gensalt())
manager_password=bcrypt.hashpw("manager".encode("utf-8"), bcrypt.gensalt())
organizer_password=bcrypt.hashpw("organizer".encode("utf-8"), bcrypt.gensalt())
cursor.execute("update users set password_hash=%s where email='admin@gmail.com'", (admin_password,))
cursor.execute("update users set password_hash=%s where email='manager@gmail.com'", (manager_password,))
cursor.execute("update users set password_hash=%s where email='organizer@gmail.com'", (organizer_password,))
conn.commit()
cursor.close()
conn.close()
