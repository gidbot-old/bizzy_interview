var string = 'name="authenticity_token" value="8RDREXeWANuBv9zOhvY1P8fkmxCofxBQWeugO6AQLLclYhkNnuG0Q/us4xlbWZEdPTWv5A2ebxKPW2pvyQ2MUQ=="';

var index = string.indexOf('value="');
console.log(string.substring(index+7, string.length-1));