var express = require('express')
var mongoose = require('mongoose')
var Location = require('../models/location')
var Plot = require('../models/plot')
var Data = require('../models/data')
var Bio = require('../models/bio')
var router = express.Router()


router.get('/', function(req, res) {
    let locations = getAllLocations( function(locations) {
        let biomass = getAllBiomass( function(biomass) {
            let current = getCurrentBiomass( biomass, locations, function(currentBiomass) {
                res.render('index', {
                    locations: locations,
                    location: locations[0],
                    user: req.user,
                    page: '/dashboard',
                    biomass: currentBiomass,
                    current: {
                        location: locations[0].location.name,
                        plot: null
                    }
                })

            })
        })
    });

})

router.get('/d/:location', function(req, res) {
    var locationid = req.params.location;
    var Location = mongoose.model('Location');

    let alllocations = getAllLocations( function(locations) {
        let singlelocation = getlocation(locationid, function(location) {
            let biomass = getAllBiomass( function(biomass) {
                let current = getCurrentBiomass( biomass, locations, function(currentBiomass) {
                    res.render('location/locations', {
                        locations: locations,
                        location: location,
                        user: req.user, 
                        biomass: currentBiomass,
                        page: '/'+location.location.name,
                        current: {
                            location: location.location.name,
                            plot: null
                        }
                    })
                })
            })
        })
    });
})

router.get('/d/:location/:plot', function(req, res) {
    let plotid = req.params.plot;
    let locationid = req.params.location;
    let alllocations = getAllLocations( function(locations) {
        let location = getlocation( locationid, function(location) {
            // console.log(location);
            let plot = getplot( plotid, function(plot) {
                // console.log(plot);
                let data = getDataByPlot(plotid, function(data) {
                    // console.log(data);
                    res.render('template-parts/plot-data', {
                        locations: locations,
                        location: location,
                        plot: plot,
                        data: data.reverse(),
                        user: req.user, 
                        page: '/dashboard/'+location.location.name + '/' + plot.info.plotnumber,
                        current: {
                            location: location.location.name,
                            plot: plot._id
                        }
                    })
                })
            });
        })
    })
})

router.get('/m/:location/:plot', function(req, res) {
    let plotid = req.params.plot;
    let locationid = req.params.location;

    let alllocations = getAllLocations( function(locations) {
        let location = getlocation( locationid, function(location) {
            // console.log(location);
            let plot = getplot( plotid, function(plot) {
                // console.log(plot);
                let data = getBioByPlot(plotid, function(data) {
                    // console.log(data);
                    res.render('pages/manual-data', {
                        locations: locations,
                        location: location,
                        plot: plot,
                        data: data.reverse(),
                        user: req.user, 
                        page: '/dashboard/'+location.location.name + '/' + plot.info.plotnumber,
                        current: {
                            location: location.location.name,
                            plot: plot._id
                        }
                    })
                })
            });
        })
    })
})

router.post('/m/:location/:plot/add', function(req, res) {
    if(req.user) {
        let plotid = req.params.plot;
        let locationid = req.params.location;

        let bio = new Bio({
            plot: req.body.plot,
            timestamp: req.body.timestamp,
            date: {
                time: req.body.time,
                date: req.body.date,
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,
                hour: req.body.hour,
                minute: req.body.minute,
                period: req.body.period,
            },
            reading: req.body.reading
        })
        console.log(req.body)
        bio.save(function(err, bio) {
            if (err) {
                throw err
            } else {
                res.send({data:bio})
            }
        })
        
    } else {
        res.redirect('/login')
    }
})

router.post('/m/:bio/delete', function(req, res) {
    Bio.findByIdAndRemove(req.params.bio, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.send({status:'sucess'})
        }
    })
})

router.post('/m/:bio/save', function(req, res) {
    Bio.update({ _id: req.params.bio }, { $set: { 
        date: {
            time: req.body.time,
            date: req.body.date,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            hour: req.body.hour,
            minute: req.body.minute,
            period: req.body.period 
        },
        reading: req.body.reading
    } }, function(err) {
        if (err) {
            console.log(err)
        } else { 
            res.send('success')
        }
    })
})

router.get('/edit/:location/:plot', function(req, res) {
    if(req.user) {
        var plotid = req.params.plot;
        var locationid = req.params.location;
        var plot = Plot.findById(plotid, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                var location = Location.findById(locationid, function(err, location) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('template-parts/edit-plot', {
                            plot: doc,
                            location: location,
                            user: req.user, 
                            page: '/dashboard'
                        })
                    }
                })
            }
        })
    } else {
        res.redirect('/login')
    }
})

router.post('/edit/:location/:plot', function(req, res) {
    if(req.user) {
        var parentid = req.params.location
        console.log(req.params)
        var plotinfo = Plot.findById(req.params.plot, function(err, plot) {
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
    } else {
        res.redirect('/login')
    }
})

router.post('/add-location', function(req, res, next) {
    if (req.user) {
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
    }
})

router.post('/d/:location/add-plot', function(req, res, next) {
    var Plot = mongoose.model('Plot');
    var Location = mongoose.model('Location');
    var parentid = req.params.location;
    var number = req.body.number
    var plot = new Plot({
        location: parentid,
        info: {
            plotnumber: number,
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

    plot.save(function(err, newplot) {
        if (err) {
            console.log(err)
        } else {

            var location = Location.findById(parentid, function(err, location) {
                location.plots.push(plot._id);
                location.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('plot added to location')
                        res.send({
                            location: location,
                            plot: newplot
                        })
                    }
                })
            });
        }
    })
})

router.post('/delete/plot/:plot', function(req, res, next) {
    var Plot = mongoose.model('Plot');
    console.log(req.params.plot)
    var plotid = req.params.plot;

    Plot.findByIdAndRemove(plotid, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.send({redirect:'/dashboard'})
        }
    })
})

router.post('/d/:location/:plot/add-data', function(req, res, next) {
    var Plots = mongoose.model('Plot');
    var Data = mongoose.model('Data')
    let offset = 240 //EDT offset
    let timestamp = new Date((req.body.timestamp * 1000) - (offset * 60000))
    let hours = function(hour) {
        if (hour > 12) {
            hour = hour - 12;
        } else if (hour === 12) {
            hour = 12;
        } else if (hour == 0) {
            hour = 12;
        }
        return hour
    }
    let ampm = function(hours) {
       return hours >= 12 ? 'pm' : 'am'
    }
    let date = {
        day: timestamp.getDate(),
        month: timestamp.getMonth()+1,
        hour: hours( timestamp.getHours() ),
        year: timestamp.getFullYear(),
        minute: ('0'+ timestamp.getMinutes()).slice(-2),
        period: ampm( timestamp.getHours() )
    }

    var reading = new Data({
        plot: req.params.plot,
        timestamp: timestamp,
        date: date,
        moisture: req.body.moisture,
        vwc: vwc(req.body.moisture),
        temp: req.body.temp
    })

    reading.save(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('data document created');

            Plots.findById(req.params.plot, function(err, plot) {
                if (err) {
                   console.log(err)
                } else {
                    console.log(data.timestamp)
                    let time = timestamp
                    let timeString =  data.date.month + '/' + data.date.day + '/' + data.date.year + ' ' + data.date.hour + ':' + data.date.minute + ' ' + data.date.period

                    plot.current = {
                        timestamp: {
                            time: time,
                            string: timeString
                        },
                        moisture: data.vwc,
                        temp: data.temp
                    }
                    plot.save(function(err, newplot) {
                        if (err) {
                            console.log(err);
                            res.send(err)
                        } else {
                            console.log('plot updated');
                            // console.log(newplot)
                            res.send('data added')
                        }
                    });
                }
            })

        }
    })
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
            res.send({ update: data });
        }
    })
})

router.get('/manual/:plot', function(req, res) {
    // if(req.user) {
        var plotid = req.params.plot;
        var plot = Plot.find({plot: plotid}, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                res.render('manual-measurements', {
                    readings: doc,
                    user: req.user, 
                    page: '/dashboard'
                })
            }
        })
    // } else {
        // res.redirect('/login')
    // }
})

router.get('/double-check', function(req, res) {
    res.render('template-parts/check', {})
})

function getAllLocations(callback) {
    var Location = mongoose.model('Location');
    var locations = Location.find({},{}).populate('plots').exec( function(err, locations){
        if(err) {
            throw err;
        } else {
            if (callback && typeof(callback) === "function") {
                callback(locations);
            }
        }
    });
}

function getAllBiomass(callback) {
    var Bio = mongoose.model('Bio');
    Bio.find({}, function(err, data){
        if(err) {
            throw err;
        } else {
            if (callback && typeof(callback) === "function") {
                callback(data);
            }
        }
    });
}

function getlocation(id, callback) {
    var Location = mongoose.model('Location');
    Location.findOne({ _id: id }).populate('plots').exec( function(err, location) {
        if(err) {
            throw err;
        } else {
            if (callback && typeof(callback) === "function") {
                callback(location);
            }
        }
    });
}

function getplot(id, callback) {
    var Plots = mongoose.model('Plot');
    Plots.findById(id, function(err,plot) {
        if(err) {
            throw err;
        } else {
            if (callback && typeof(callback) === "function") {
                callback(plot);
            }
        }
    })
}

function getDataByPlot(id, callback) {
    var Data = mongoose.model('Data');
    var data = Data.find({ plot: id }).sort({timestamp: 1}).exec( function(err, data) {
        if (err) {
            console.log(err)
        } else {
            if (callback && typeof(callback) === "function") {
                callback(data);
            }
        }
    })
}

function getBioByPlot(id, callback) {
    var Data = mongoose.model('Bio');
    var data = Data.find({ plot: id }).sort({timestamp: 1}).exec( function(err, data) {
        if (err) {
            console.log(err)
        } else {
            if (callback && typeof(callback) === "function") {
                callback(data);
            }
        }
    })
}

function getCurrentBiomass(biomass, locations, callback) {
    var current = []

    for (var i = 0; i < locations[0].plots.length; i++) {

        let id = locations[0].plots[i]._id
        // console.log(id)
        let length = biomass.length
        let bioByPlot = []

        for (var j = 0; j < length; j++) {
            let doc = (biomass[j].plot).toString()
            let plot = (id).toString()
            if( doc === plot ){
                bioByPlot.push(biomass[j])
            }
        }

        bioByPlot.sort(function(a,b) {
            a.date.date - b.date.date
        })

        current[id] = bioByPlot[0]

    }

    if (callback && typeof(callback) === "function") {
        callback(current);
    }

}

function vwc(reading) {
    let vwc = (reading - 113) * (100 - 0) / (907 - 113) + 0
    return +((vwc).toFixed(2))
}

module.exports = router