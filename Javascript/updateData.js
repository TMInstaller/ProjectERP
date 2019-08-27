exports.updateData = function (object_1, object_2, objectID, collection, modifierNumber) {
	var data = {};
	var oldProperty = {};
	var newProperty = {};
	for (var propertyName in object_2) {
		if (object_1[propertyName] != object_2[propertyName]) {
			oldProperty[propertyName] = object_1[propertyName];
			newProperty[propertyName] = object_2[propertyName];
		}
	}
	data = {
		Collection: collection,
		ObejctID: objectID,
		Old: oldProperty,
		New: newProperty,
		ModifierNumber: modifierNumber
	}
	return data;
}