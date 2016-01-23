
/*
 * GET home page.
 */

// Static
var namedefault = 'solver';

exports.index = function(req, res){
	res.render('index', {
		title: 'Word Puzzle Blackboard',
		user: namedefault+Math.ceil(Math.random()*1000)
	})
};
