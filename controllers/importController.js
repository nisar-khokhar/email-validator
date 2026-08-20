// const csv = require("csvtojson");
const fs = require("fs");
const csvParser = require("csv-parser");
const validator = require("deep-email-validator");
const { Parser } = require("json2csv");
let { emailresponse } = require("../models/emailresponse");

let CsvData;

/*const importUser = async (req, res) => {
  const userData = [];

  try {
    csv()
      .fromFile(req.file.path)
      .then((response) => {
        for (let x = 0; x < response.length; x++) {
          // const { valid } = validator.validate(response[x].Email);
          userData.push({
            email: response[x].Email,
            // valid: valid,
          });
        }

        const jsonString = JSON.stringify(userData);
        fs.writeFile("data.json", jsonString, (err) => {
          if (err) {
            console.log("Error writing file", err);
          } else {
            console.log("Successfully wrote file");
            res.send({ status: 200, success: true, msg: "running" });
          }
        });
      });
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};*/

const importUser = async (req, res) => {
  const filepath = req.file.path;
  console.log(filepath);

  const filestream = fs.createReadStream(filepath);
  const processedData = [];
  const processedDataforDb = [];

  filestream
    .pipe(csvParser())
    .on("data", async (row) => {
      // const processedRow = {
      //   Email: row.Email,
      // };

      // processedData.push(processedRow);
      processedData.push(row);
      processedDataforDb.push({ Email: row.Email });
    })
    .on("end", async () => {
      // const csvFields = ["name", "phone", "email", "valid"];
      const CsvParse = new Parser();
      const csvparsedb = new Parser();
      console.log(processedData.length);
      CsvData = CsvParse.parse(
        await Promise.all(
          processedData.map(async (obj) => {
            const { valid, reason, validators } = await validator.validate(
              obj.Email
            );

            if (valid) {
              obj.Valid = 1;
            } else {
              obj.Valid = 0;
            }

            // console.log(obj.Valid);
            return obj;
          })
        )
      );

      console.log(processedDataforDb.length);

      const csvdbdatda = csvparsedb.parse(
        await Promise.all(
          processedDataforDb.map(async (item) => {
            const { valid, reason, validators } = await validator.validate(
              item.Email
            );
            item.Valid = valid;
            if (reason) {
              item.R = reason;
            } else {
              item.R = "Valid Email";
            }
            item.T = validators.typo.valid;
            item.S = validators.smtp.valid;
            item.M = validators.mx.valid;
            item.D = validators.disposable.valid;
            item.RE = validators.regex.valid;
            // console.log(item);
            return item;
          })
        )
      );

      fs.writeFile(filepath, CsvData, (error) => {
        if (error) {
          console.error("Error writing to CSV file:", error);
        } else {
          console.log("CSV file updated successfully");

          pushdatatoDatabase(processedDataforDb);
          // res.json("HELLO");
        }
      });

      // const CsvforDb = new Parser();
      // const CsvP = CsvforDb.parse(
      //   await Promise.all(
      //     processedDataforDb.map(async (item) => {
      //       const { valid, reason, validators } = await validator.validate(
      //         item
      //       );
      //       const data = { item, valid };
      //       await emailresponse.bulkCreate(data);
      //     })
      //   )
      // );

      const pushdatatoDatabase = async (data) => {
        console.log("Entered Database Function");
        try {
          /*const dataa = data.map(async (item) => {
            const { valid, reason, validators } = await validator.validate(
              item.Email
            );
            if (valid) {
              return {
                ...item,
                Valid: 1,
              };
            } else if (!valid) {
              return {
                ...item,
                Valid: 0,
              };
            } else {
              return item;
            }
          });
          console.log(dataa);*/
          const data1 = await emailresponse
            .bulkCreate(
              data.map((value) => ({
                Email: value.Email,
                Valid: value.Valid,
                Reason: value.R,
                Typo: value.T,
                Smtp: value.S,
                Regex: value.RE,
                Disposible: value.D,
                Mx: value.M,
              }))
              // dataa
            )
            .then(() => console.log("created Database"));
          console.log("Column data inserted into the database successfully");
        } catch (error) {
          console.error(error.message);
        }
      };

      res.send({ status: 200, success: true, msg: "done" });
    })
    .on("error", (error) => {
      res.status(500).send("Error occured while processing the csv file");
    });
};

const exportUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment: filename = validatedData.csv"
    );

    res.status(200).end(CsvData);
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = {
  importUser,
  exportUser,
};
