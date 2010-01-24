(function() {

	var xml = require('./node-xml');
	
	var XmlNode = function(nodeName, attributes, parentNode) 
	{
		this.nodeName = nodeName || 'root';
		var attributesAsObject = {};
		if (attributes) {
			var node = this;
			attributes.forEach(function(element, index, array)
				{
					var key = element[0];
					var value = element[1];
					attributesAsObject[key] = value;
					node.__defineGetter__(
						'@' + key, 
						function()
						{
							return value;
						}
					);
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
	
	XmlNode.prototype._createChildAccessors = function()
	{
		var childrenByNodeName = {};
		this.children.forEach(function(element, index, array)
			{
				childrenByNodeName[element.nodeName] = childrenByNodeName[element.nodeName] || [];
				childrenByNodeName[element.nodeName].push(element);
			}
		);
		for (var nodeName in childrenByNodeName) {
			this.__defineGetter__(
				nodeName,
				function()
				{
					return childrenByNodeName[nodeName].length > 1 ? 
						childrenByNodeName[nodeName] : 
						childrenByNodeName[nodeName][0]
				}
			);
		}
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
				currentNode._createChildAccessors();
				callback(currentNode);
			});
			cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
				var newNode = new XmlNode(elem, attrs, currentNode);
				currentNode = newNode;
				//sys.puts('onStartElementNS');
				//sys.puts(sys.inspect(arguments));
			});
			cb.onEndElementNS(function(elem, prefix, uri) {
				currentNode._createChildAccessors();
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
