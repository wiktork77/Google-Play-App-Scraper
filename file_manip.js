const { count } = require('console');
const fs = require('fs');
const readline = require('readline');


async function fileToSet(path) {
    return new Promise((resolve, reject) => {
      const set = new Set();
      const fileStream = fs.createReadStream(path);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
  
      rl.on('line', (line) => {
        // Przetwarzanie linii
        set.add(line);
      });
  
      rl.on('close', () => {
        resolve(set);
      });
  
      fileStream.on('error', (err) => {
        reject(err);
      });
    });
  }


  async function createFile(path) {
    console.log("trying to create a file at " + path);
    try {
      fs.open(path, "wx", function (err, fd) {
        // handle error
        fs.close(fd, function (err) {
            // handle error
        });
    });
      console.log("created file");
    } catch (err) {
        console.log("failed at creating file: " + err);
    }
  }

async function appendsIdsToFile(ids, path) {
    if (!fs.existsSync(path)) {
      await createFile(path);
    }
    file_set = await fileToSet(path);
    let count = 0
    for (i = 0; i < ids.length; i++) {
        if (!file_set.has(ids[i].toString())) {
            appendToFile(ids[i].toString(), path)
            count += 1
        }
    }
    return count
}


function getFileName(path) {
  spl = path.split("/")
  elem = spl[spl.length - 1]
  return elem.slice(0, elem.length - 4)
}


function appendToFile(content, path) {
  // flexible
    content = content + '\n'
    fs.open(path, 'a', (err, fd) => {
        if (err) {
          console.error(err);
          return;
        }
        fs.write(fd, content, (err) => {
          if (err) {
            console.error(err);
          }
          fs.close(fd, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      });
}

module.exports = {
    appendsIdsToFile,
    fileToSet,
    appendToFile,
    getFileName
}