/**
 * Validate if the given value is correct for a given type in the search bar
 * @param type the type of the component - { "search", "type" }
 * @param value the value of the component
 * @returns if the value is correct for that type of component, or returns false
 */
export function validate(type, value) {
    if(type === "search") {
        return true;
    } else if(type === "type") {
        return [ "movie", "genre", "user" ].includes(value);
    } else return false;
}