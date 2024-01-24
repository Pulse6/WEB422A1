/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Marco Siu Student ID: 165093220 Date: Jan 24, 2024
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const HTTP_PORT = 8080;

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});
// POST /api/listings
app.post('/api/listings', (req, res) => {
  db.addNewListing(req.body)
    .then((createdListing) => res.status(201).json(createdListing))
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});
// GET /api/listings
app.get('/api/listings', (req, res) => {
  db.getAllListings({ page: req.query.page, perPage: req.query.perPage, name: req.query.name })
    .then((listings) => res.status(200).json(listings))
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});
// GET /api/listings/(_id value)
app.get('/api/listings/:id', (req, res) => {
  db.getListingById(req.params.id)
    .then((listing) => {
      if (!listing) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      res.status(200).json(listing);
    })
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});
// PUT /api/listings/(_id value)
app.put('/api/listings/:id', (req, res) => {
  db.updateListingById(req.params.id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      res.status(200).json({ message: 'Listing updated successfully' });
    })
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});
// DELETE /api/listings/(_id value)
app.delete('/api/listings/:id', (req, res) => {
  db.deleteListingById(req.params.id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      res.status(204).json();
    })
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});

app.all('*', (req,res) => {
  res.json({"every thing":"is awesome"})
})

// app.listen(port, () => {
//   console.log(`Server ready, running on http://localhost:${port} ${process.env.USER}`);
// });
db.initialize(process.env.MONGODB).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: http://localhost:${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log(err);
});
