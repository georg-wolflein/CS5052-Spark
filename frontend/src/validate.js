/**
 * Validate if the given value is correct for a given type in the search bar
 * This is an external function as there is no way to pass props to the results component through react-router
 * @param type the type of the component - { "search", "type" }
 * @param value the value of the component - should be a dict with `search` & `type` items
 * @returns if the value is correct for that type of component, or returns false
 */
export function validate(type, value) {
    if(type === "search") {
        // Short circuit for no value -- dont display error when user hasnt entered anything
        if(value.search === "") return true;
        if(value.type === "user") {
            // Only allow numbers, commas & spaces when the type is user
            return !/\D$/.test(value.search);
        } else if(value.type === "genre") {
            // Should be in our genre array
            return true;
        } else {
            // Otherwise, simply ensure there is some content
            return !/^\s*$/.test(value.search);
        }
    } else if(type === "type") {
        return [ "movie", "genre", "user" ].includes(value.type);
    } else return false;
}