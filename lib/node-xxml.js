// node-xxml
// An (incomplete) E4X inspired wrapper around the node-xml parser for node.js - parses XML
// documents into easily accessed object structures.
// (C) Kelvin Luck (@vitch) 2010, Licensed under the MIT-LICENSE
(function() {

	var sys = require('sys'),
		http = require('http'),
		url = require('url'),
		xml = require('./node-xml');
	
	var XmlNode = function(nodeName, attributes, parentNode) 
	{
		this.nodeName = nodeName;
		var attributesAsObject = {};
		if (attributes) {
			var node = this;
			attributes.forEach(function(element, index, array)
				{
					var key = element[0];
					var value = element[1];
					attributesAsObject[key] = value;
					var getVal = function()
					{
						return value;
					};
					node.__defineGetter__(
						'@' + key, 
						getVal
					);
					node.__defineGetter__(
						'_' + key, 
						getVal
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
					var matchingChildren = childrenByNodeName[nodeName];
					return matchingChildren.length > 1 ? 
						matchingChildren : 
						matchingChildren[0]
				}
			);
		}
	};
	
	XmlNode.prototype.toString = function()
	{
		if (this.nodeName == undefined) {
			return this.children[0].toString();
		}
		var str = '';
		str += '<' + this.nodeName;
		for (var attribute in this.attributes) {
			str += ' ' + attribute + '="' + this.attributes[attribute] + '"';
		}
		if (this.children.length > 0) {
			str += '>\n';
			this.children.forEach(function(element, index, array){
				str += '\t' + element;
			});
			str += '</' + this.nodeName + '>\n';
		}
		else {
			str += ' />\n';
		}
		return str;
	};
	
	var XXParser = function(callback)
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
				currentNode = new XmlNode(elem, attrs, currentNode);;
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
		
		return {
			parseFile: function(filename){
				parser.parseFile(filename);
			},
			parseString: function(str){
				parser.parseString(str);
			}
		}
	};
	
	process.mixin(
		exports,
		{
			parseXmlFile : function(filename, callback)
			{
				var xxParser = new XXParser(callback);
				xxParser.parseFile(filename);
			},
			parseXmlString : function(str, callback)
			{
				var xxParser = new XXParser(callback);
				xxParser.parseString(str);
			},
			parseXmlUrl : function(requestUrl, callback)
			{
				var urlParts = url.parse(requestUrl);
				var client = http.createClient(80, urlParts.host);
				var request = client.request('GET', urlParts.pathname + (urlParts.search || ''), {'Host' : urlParts.host});
				request.finish(
					function(response)
					{
						var responseBody = '';
						response.addListener(
							'body', 
							function (chunk) {
								responseBody += chunk;
							}
						);
						response.addListener(
							'complete',
							function()
							{
								exports.parseXmlString(responseBody, callback);
							}
						);
					}
				);
			}
		}
	);
	
})();
