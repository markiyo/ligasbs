var mongoose = require('mongoose'),
League = mongoose.model('League');

function validatorLength(val) {
	return val.length <= 5;
}

var min = [0, 'The value of `{PATH}` must be a possitive number.'];
var maxGoals = [100, "Don´t think the `{PATH}` is ({VALUE}). This value is greater than the limit ({MAX})."];
var numberGoals = { type: Number, min: min, max: maxGoals }


var matchSchema = mongoose.Schema({	
	league_id : mongoose.Schema.Types.ObjectId,			
	played: {type: Boolean, required:true},
	dateOfMatch: {type: Date, required: '{PATH} is required'},
	result: {darkTeam: numberGoals, lightTeam: numberGoals},
	location: {type: String, required: '{PATH} is required'},
	darkTeam: {type: [{name:String, scoredGoals:numberGoals}], validate: [validatorLength, 'The length of the team cannnot exceed 5 players']},
	lightTeam: {type: [{name:String, scoredGoals:numberGoals}], validate: [validatorLength, 'The length of the team cannnot exceed 5 players']}	
});

function isValidMethod(match) {
	match.errors = [];
	var isMatchValid = true;

	if(match.result.lightTeam !==  0 && !match.result.lightTeam) {
		match.errors.push("The result of the lightTeam is invalid");
	}
	if(match.result.darkTeam !== 0 && !match.result.darkTeam) {
		match.errors.push("The result of the darkTeam is invalid");
	}
	if(match.result.lightTeam < 0 || match.result.lightTeam > 99) {
		match.errors.push("The result of the lightTeam is invalid");
	}
	if(match.result.darkTeam < 0 || match.result.darkTeam > 99) {
		match.errors.push("The result of the darkTeam is invalid");
	}	
	return match.errors.length === 0;
}

function createNewMatch() {
	var m = new Match();
	m.played = false;
	m.dateOfMatch = new Date();
	m.location = '';
	m.result = {darkTeam: 0, lightTeam: 0};
	var emptyTeam = [{name:'', scoredGoals: 0}, {name:'', scoredGoals: 0}, {name:'', scoredGoals: 0}, {name:'', scoredGoals: 0}, {name:'', scoredGoals: 0}];
	m.lightTeam = emptyTeam;
	m.darkTeam = emptyTeam;
	League.findOne({Open:true},
			function(err, league) {				
				m.league_id = league._id;				
			});
	return m;
}

 matchSchema.statics.isValid = isValidMethod;
 matchSchema.statics.createNew = createNewMatch;

var Match = mongoose.model('Match', matchSchema);

function createDefaultMatch() {
	Match.find({}).find(function(err, collection){
		if(collection.length === 0) {
			var darkTeam = [{name:'Diego', scoredGoals: 0}, {name:'Jose', scoredGoals: 0}, {name:'Alfonso', scoredGoals: 0}, {name:'Emilio', scoredGoals: 0}, {name:'Sergio', scoredGoals: 0}];
			var lightTeam = [{name:'David P', scoredGoals: 0},{name:'Antonio Garcia', scoredGoals: 0},{name:'Lazaro', scoredGoals: 0},{name:'Marcos', scoredGoals: 0},{name:'Gines', scoredGoals: 0}];
			League.findOne(
				function(err, league) {
					Match.create(
						{
							dateOfMatch: '31 Jun 2014 20:00', 
							location: 'Uni',
							played: false,
							darkTeam: darkTeam, 
							lightTeam: lightTeam,
							league_id: league._id,
							result : {darkTeam: 0, lightTeam: 0}
						}
					);

				});
		}
	});
}

exports.createDefaultMatch = createDefaultMatch;

