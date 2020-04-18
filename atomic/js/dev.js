(function() {
	var sizeSpans = [];
	
	function updateSizeSpan(ele, span) {
		var w = ele.offsetWidth;
		var h = ele.offsetHeight;
		span.innerHTML = w + "&times;" + h;
	}
	
	function wrapOutline(ele) {
		if (ele.classList.contains("outline") || 
				ele.classList.contains("size")) {
			// To avoid nesting outlines or adding an outline to the size
			return;
		}
		
		// Size span
		var span = document.createElement("span");
		span.classList.add("size");
		updateSizeSpan(ele, span);
		sizeSpans.push(span);
		
		// Outline
		var outline = document.createElement("div");
		outline.classList.add("outline");
		
		// Wrap the element with the outline div
		var parent = ele.parentNode;
		parent.replaceChild(outline, ele);
		outline.appendChild(ele);
		outline.appendChild(span);
		
		// Unwrapping handler
		outline.addEventListener("click", function (e) {
			var outline = e.target;
			while (!outline.classList.contains("outline")) {
				// Make sure to deal with the outline div directly
				outline = outline.parentNode;
			}
			var ele = outline.firstChild;
			var parent = outline.parentNode;
			
			// Unwrap the element
			outline.removeChild(ele);
			parent.replaceChild(ele, outline);
			
			// Remove span from sizeSpans;
			var span = outline.lastChild;
			sizeSpans.splice(sizeSpans.indexOf(span), 1);
			
			// Un-highlight the text
			var instance = new Mark(ele);
			instance.unmark();
			
			e.stopPropagation();
		});
	}
	
	function highlight(ele) {
		var instance = new Mark(ele);
		instance.markRanges([{start: 45, length: 30}], {
			element: "span",
			className: "highlight"
		});
	}
	
	var all = document.body.getElementsByTagName("*");
	for (var i = 0; i < all.length; i++) {
		if (all[i].parentNode !== document.body) {
			continue;
		}
		
		all[i].addEventListener("click", function(e) {
			var ele = e.target;
			
			if (ele.tagName == "DIV" || ele.tagName == "BODY") {
				// Avoid dealing with divs or the body tag
				return;
			}
			
			while (ele.parentNode &&
						 ele.parentNode.tagName != "DIV" &&
						 ele.parentNode.tagName != "BODY") {
				// Recurse up to avoid dealing with the smaller leaf nodes
				ele = ele.parentNode;
			}
			
			highlight(ele);
			wrapOutline(ele);
		});
	}
	
	if (typeof(document.documentElement.clientWidth) != 'undefined') {
		var $w = document.getElementById('w'),
				$h = document.getElementById('h');
		$w.innerHTML = document.documentElement.clientWidth;
		$h.innerHTML = ' &times; ' + document.documentElement.clientHeight;
		
		window.onresize = function(event) {
			// Update the size in the upper-right corner
			$w.innerHTML = document.documentElement.clientWidth;
			$h.innerHTML = ' &times; ' + document.documentElement.clientHeight;
			
			// Update the size spans
			for (var i = 0; i < sizeSpans.length; i++) {
				var span = sizeSpans[i];
				var ele = span.parentNode.firstChild;
				updateSizeSpan(ele, span);
			}
		};
	}
})();