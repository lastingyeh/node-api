var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();
var Bear = require('./app/models/bear');

// mongo db initial
mongoose.connect('mongodb://localhost:27017/nodejs');

// log requests to the console
app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// port settings
var port = process.env.PORT || 8080;

// build router
var router = express.Router();

app.use('/api', router);

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('middlewar for use requests...');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'welcome to our api!' });
});

// routes that end in /bears
router
	.route('/bears')
	.post(function(req, res) {
		var bear = new Bear();

		bear.name = req.body.name;

		bear.save(function(err) {
			if (err) res.send(err);

			res.json({ message: 'Bear created!' });
		});
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) res.send(err);

			res.json(bears);
		});
	});

// get the bear with that id
router
	.route('/bears/:bear_id')
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) res.send(err);

			res.json(bear);
		});
	})
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err) res.send(err);

				res.json({ message: 'Bear updated!' });
			});
		});
	})
	.delete(function(req, res) {
		Bear.remove(
			{
				_id: req.params.bear_id
			},
			function(err, bear) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			}
		);
	});

app.listen(port);

console.log(`server is running on port: ${port}`);
