// function wrapAsync(fn) {
//     return function (req, res, next) {
//         fn(req, res, next).catch(next)
//     }
// }

//or

module.exports = (fn) =>{
    return (req,res,next) =>{
        fn(req, res, next).catch(next);
    }
}


//wrapAsync uses, In Express v4, if an async route throws an error or rejects a promise, Express won’t catch it automatically, and the app might crash or hang.
// That’s why we wrap async routes like this:

// wrapAsync.js
// module.exports = function wrapAsync(fn) {
//     return function (req, res, next) {
//         fn(req, res, next).catch(next);
//     };
// };

// // app.js or routes file 
// const wrapAsync = require('./utils/wrapAsync');

// app.get('/listings', wrapAsync(async (req, res) => {
//     const listings = await Listing.find();
//     res.render('listings/index', { listings });
// }));

// // Error handler at bottom
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).send('Something went wrong: ' + err.message);
// });

//but Express v5 automatically catches errors thrown in async functions and passes them to the error-handling middleware.
// app.get('/listings', async (req, res) => {
//     const listings = await Listing.find(); // if this fails, Express will catch it
//     res.render('listings/index', { listings });
// });
// If Listing.find() throws an error (e.g., DB is down), Express will automatically call your error middleware:
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).send('Something went wrong!');
// });
