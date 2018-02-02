var express = require('express')
var mongoose = require('mongoose')
var Location = require('../models/location')
var Plot = require('../models/plot')
var Data = require('../models/data')
var router = express.Router()

router.get('/dashboard', function(req, res) {
    
    // if(req.user) {
        var Location = mongoose.model('Location');
        Location.find({},{}).populate('plots').exec( function(e,docs){
            console.log(docs)
            res.render('dashboard', {
                locations: docs,
                user: req.user, 
                page: '/dashboard',
                reviews: "",
            })
        });
    // } else {
        // res.redirect('/login')
    // }

})

router.get('/edit/:location/:plot', function(req, res) {
    // if(req.user) {
        var plotid = req.params.plot;
        var plot = Plot.findById(plotid, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                res.render('edit-plot', {
                    plot: doc,
                    user: req.user, 
                    page: '/dashboard'
                })
            }
        })
    // } else {
        // res.redirect('/login')
    // }
})

router.post('/edit/:location/:plot', function(req, res) {
    // if(req.user) {
        var parentid = req.params.location
        var plotid = req.params.plot

        var plotinfo = Plot.findById(plotid, function(err, plot) {
            if (err) {
                console.log(err);
            } else {
                plot.info.crops = req.body['crops[]'];
                plot.info.vwc.saturation = req.body.saturation;
                plot.info.vwc.capacity = req.body.capacity;
                plot.info.vwc.dry = req.body.dry;

                plot.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send('plot updated')
                    }
                });
            }
        })
    // } else {
        // res.redirect('/login')
    // }
})

router.post('/dashboard/add-location', function(req, res, next) {
    console.log(req.body)
    var Location = mongoose.model('Location')
    // console.log(JSON.stringify(count, null, 2))

    var location = new Location ({
        location: {
            name: req.body.name,
            address: req.body.address
        },
        meta: {
            created: {
                username: req.user,
                date: new Date().getTime()
            },
            updated: {
                username: req.user,
                date: new Date().getTime()
            }
        }
    })

    location.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.send('location added')
        }
    })
})

router.post('/:location/add-plot', function(req, res, next) {
    var Plot = mongoose.model('Plot');
    var Location = mongoose.model('Location');
    var parentid = req.params.location;
    var number = Plot.length;
    // console.log('id: '+ parentid)
    var plot = new Plot({
        location: parentid,
        info: {
            plotnumber: number+1,
            crops: ['wheatgrass', 'test'],
            water: Math.floor(Math.random()*4)
        },
        data: [],
        meta: {
            created: {
                username: req.user,
                date: new Date().getTime()
            },
            updated: {
                username: req.user,
                date: new Date().getTime()
            }
        }
    })

    plot.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.send('plot added');

            var location = Location.findById(parentid, function(err, location) {
                location.plots.push(plot._id);
                location.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('plot added to location')
                    }
                })
            });
        }
    })
})

router.post('/:location/:plot/add-data', function(req, res, next) {
    var Plots = mongoose.model('Plot');
    var Data = mongoose.model('Data');
    var reading = new Data({
        plot: req.params.plot,
        timestamp: new Date(),
        moisture: Math.floor(Math.random()*24),
        temp: Math.floor(Math.random()*75)
    })
    reading.save(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('data added');

            Plots.findById(req.params.plot, function(err, plot) {
                if (err) {
                   console.log(err)
                } else {
                    var hours = data.timestamp.getHours();
                    var minutes = data.timestamp.getMinutes();
                    if ( minutes < 10 ) {
                        minutes = '0' + minutes
                    }
                    var period = function(time) {
                        if (time > 12) {
                            hours = hours - 12;
                            return 'PM';
                        } else if ( time = 12) {
                            return 'PM';
                        } else if (time < 12) {
                            return 'AM';
                        }
                    }
                    console.log('found plot'); 
                    plot.current = {
                        timestamp: {
                            time: data.timestamp,
                            string: hours + ':' + minutes + ' ' + period(hours)
                        },
                        moisture: data.moisture,
                        temp: data.temp
                    }
                    plot.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('plot updated');
                        }
                    });
                }
            })

        }
    })
    res.send('data added')
})

router.get('/update', function(req, res) {
    var Plots = mongoose.model('Plot');
    var data = [];

    var allPlots = Plots.find({}, function(err, plots) {
        if (err) {
            console.log(err)
        } else {
            for (var i = plots.length - 1; i >= 0; i--) {
                var plot = {
                    id: plots[i]._id,
                    current: plots[i].current
                }  
                data.push(plot)
            }
            res.send({ update: data});
        }
    })
})

module.exports = router