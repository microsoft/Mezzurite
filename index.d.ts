/**
 * A ComponentStartData contains the information necessary
 * to register a component instance with Mezzurite. This is meant
 * to be called with the 'mezzurite/componentStart' CustomEvent
 * as follows:
 * @example
 * window.dispatchEvent(new CustomEvent('mezzurite/componentStart', {
 *  detail: ComponentStartData
 * }));
 * 
 * @param id A uniquely identifiable string that corresponds to
 * a specific instance of a registered component. Different
 * components must have different ids, even if they have the same
 * name. When creating an object of type ComponentStartData, it
 * is better to use a hashing algorithm to generate a unique id,
 * like the following:
 * https://www.npmjs.com/package/uuid
 * 
 * @param name An identifier that refers to what kind of component
 * is being tracked. It is quite possible this takes the form of
 * the name of the class or variable that represents the component,
 * or the name of the custom tag. Different MezzuriteComponents of
 * the same type will have the same name.
 */
export interface ComponentStartData {
  id: string;
  name: string;
};

/**
 * A ComponentEndData contains the information necessary to finish
 * a component instance with Mezzurite. This is meant to be called
 * with the 'mezzurite/componentEnd' CustomEvent as follows:
 * @example
 * window.dispatchEvent(new CustomEvent('mezzurite/componentEnd', {
 *  detail: ComponentEndData
 * }));
 * 
 * 
 * @param id A uniquely identifiable string that corresponds to
 * a specific instance of a registered component. Different
 * components must have different ids, even if they have the same
 * name.
 */
export interface ComponentEndData {
  id: string;
};

/**
 * A MezzuriteData contains a snapshot of all the component data within
 * the Mezzurite store. These component snapshots will be of the data
 * when a component has started but not ended, or a component that
 * has both started and ended.
 * 
 * @param id A listing of all the components currently registered with
 * Mezzurite by id. Ids are uniquely identifiable strings that correspond
 * to a specific instance of a registered component. Different components
 * must have different ids.
 */
export interface MezzuriteData {
  [id: string]: ComponentStartSnapshot | ComponentEndSnapshot;
};

/**
 * A ComponentStartSnapshot contains a snapshot of a singular Mezzurite
 * component that has started rendering but has not finished.
 * 
 * @param name An identifier that refers to what kind of component
 * is being tracked. It is quite possible this takes the form of
 * the name of the class or variable that represents the component,
 * or the name of the custom tag. Different MezzuriteComponents of
 * the same type will have the same name.
 * 
 * 
 * @param startTime A start time metric contains the time stamp of
 * when the component began rendering. In modern browsers, this is
 * done by using performance.now(), which results in a high resolution
 * time stamp. In older browsers which do not have this capability,
 * this will degrade to use Date.now(), which returns a number.
 */
interface ComponentStartSnapshot {
  name: string;
  startTime: DOMHighResTimeStamp | number;
};

/**
 * A ComponentEndSnapshot contains a snapshot of a singular Mezzurite
 * component that has finished rendering.
 * 
 * @param endTime An end time metric contains the time stamp of
 * when the component finished rendering. In modern browsers, this is
 * done by using performance.now(), which results in a high resolution
 * time stamp. In older browsers which do not have this capability,
 * this will degrade to use Date.now(), which returns a number.
 * 
 * 
 * @param name An identifier that refers to what kind of component
 * is being tracked. It is quite possible this takes the form of
 * the name of the class or variable that represents the component,
 * or the name of the custom tag. Different MezzuriteComponents of
 * the same type will have the same name.
 * 
 * 
 * @param startTime A start time metric contains the time stamp of
 * when the component began rendering. In modern browsers, this is
 * done by using performance.now(), which results in a high resolution
 * time stamp. In older browsers which do not have this capability,
 * this will degrade to use Date.now(), which returns a number.
 * 
 */
interface ComponentEndSnapshot {
  endTime: DOMHighResTimeStamp | number;
  name: string;
  startTime: DOMHighResTimeStamp | number;
};

/**
 * Sets up Mezzurite store and corresponding event hooks
 * for starting and stopping a component. CustomEvents
 * prefixed with 'mezzurite/' before this function is called
 * will not be handled.
 */
export default function initializeMezzurite(): void;
