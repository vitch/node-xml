(function() {

	var xml = require('./node-xml');
	
	var XmlNode = function(nodeName, attributes, parentNode) 
	{
		this.nodeName = nodeName || 'root';
		var attributesAsObject = {};
		if (attributes) {
			attributes.forEach(function(element, index, array)
				{
				attributesAsObject[element[0]] = element[1];
				}
			);
		}
		this.attributes = attributesAsObject;
		if (parentNode) {
			this.parentNode = parentNode;
			parentNode.children.push(this);
		}
		this.children = [];
	};
	
	
	exports.parseXml = function(filename, callback)
	{
		var currentNode = new XmlNode();
		var parser = new xml.SaxParser(function(cb) {
			cb.onStartDocument(function() {
				//sys.puts('onStartDocument');
				//sys.puts(sys.inspect(arguments));
			});
			cb.onEndDocument(function() {
				//sys.puts('onEndDocument');
				//sys.puts(sys.inspect(arguments));
				callback(currentNode);
			});
			cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
				var newNode = new XmlNode(elem, attrs, currentNode);
				currentNode = newNode;
				//sys.puts('onStartElementNS');
				//sys.puts(sys.inspect(arguments));
			});
			cb.onEndElementNS(function(elem, prefix, uri) {
				currentNode = currentNode.parentNode;
				//sys.puts('onEndElementNS');
				//sys.puts(sys.inspect(arguments));
			});
			cb.onCharacters(function(chars) {
				//sys.puts('onCharacters');
				//sys.puts(sys.inspect(arguments));
			});
			cb.onCdata(function(cdata) {
				sys.puts('onCdata');
				sys.puts(sys.inspect(arguments));
			});
			cb.onComment(function(msg) {
				sys.puts('onComment');
				sys.puts(sys.inspect(arguments));
			});
			cb.onWarning(function(msg) {
				sys.puts('onWarning');
				sys.puts(sys.inspect(arguments));
			});
			cb.onError(function(msg) {
				sys.puts('onError');
				sys.puts(sys.inspect(arguments));
			});
		});
		
		parser.parseFile(filename);
	}
	
})();
