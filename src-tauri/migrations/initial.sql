CREATE TABLE messages (
  id CHAR(24) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  thumb VARCHAR(1000) NOT NULL,
  createdAt TIMESTAMP DEFAULT (datetime('now', 'localtime')),
  updatedAt TIMESTAMP DEFAULT (datetime('now', 'localtime')),
  tags VARCHAR(1000),
  category CHAR(10),
  fileType CHAR(10),
  filePath VARCHAR(1000),
  fileRaw BLOB,
  fileFrom CHAR(10)
);
