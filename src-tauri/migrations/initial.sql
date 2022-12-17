CREATE TABLE messages (
  id CHAR(24) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  thumb VARCHAR(1000),
  createdAt TIMESTAMP DEFAULT (datetime('now', 'localtime')),
  updatedAt TIMESTAMP DEFAULT (datetime('now', 'localtime')),
  tags VARCHAR(1000),
  category CHAR(10),
  content VARCHAR,
  fileExt CHAR(10),
  filePath VARCHAR(1000),
  fileFrom CHAR(10),
  link VARCHAR(1000),
  size INTEGER,
  width INTEGER,
  height INTEGER
);
