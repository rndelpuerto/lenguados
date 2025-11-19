/**
 * @file src/interfaces/serializable.ts
 * @module math2d/interfaces/serializable
 * @description Interface for objects that can be serialized and deserialized.
 * 
 * @remarks
 * This interface defines the contract for types that support various
 * forms of serialization, including JSON, arrays, and string representations.
 */

/**
 * Interface for objects that can be serialized to various formats.
 * 
 * @typeParam TArray - The array type for array serialization (e.g., number[] or Float32Array).
 * @typeParam TObject - The object type for object serialization.
 */
export interface Serializable<TArray extends ArrayLike<number> = number[], TObject = any> {
  /**
   * Converts this object to a plain JavaScript object.
   * 
   * @returns A plain object representation.
   */
  toObject(): TObject;

  /**
   * Converts this object to a JSON-serializable format.
   * 
   * @returns A JSON-compatible representation.
   * @remarks
   * This method is automatically called by JSON.stringify().
   */
  toJSON(): TObject;

  /**
   * Converts this object to an array.
   * 
   * @param out - Optional array to write values into.
   * @param offset - Starting index in the output array.
   * @returns The array containing the serialized values.
   */
  toArray<T extends TArray>(out?: T, offset?: number): T;

  /**
   * Converts this object to a string representation.
   * 
   * @param precision - Number of decimal places for numeric values.
   * @returns A string representation of the object.
   */
  toString(precision?: number): string;

  /**
   * Creates a deep copy of this object.
   * 
   * @returns A new instance with the same values.
   */
  clone(): this;
}

/**
 * Static interface for serializable operations.
 * 
 * @typeParam T - The type being serialized/deserialized.
 * @typeParam TArray - The array type for array operations.
 * @typeParam TObject - The object type for object operations.
 */
export interface SerializableStatic<T, TArray extends ArrayLike<number> = number[], TObject = any> {
  /**
   * Creates an instance from a plain object.
   * 
   * @param obj - The object to deserialize from.
   * @returns A new instance.
   * @throws {TypeError} If the object format is invalid.
   */
  fromObject(obj: TObject): T;

  /**
   * Creates an instance from a plain object, writing to an output instance.
   * 
   * @param obj - The object to deserialize from.
   * @param out - The instance to write values to.
   * @returns The `out` instance with updated values.
   * @throws {TypeError} If the object format is invalid.
   */
  fromObject(obj: TObject, out: T): T;

  /**
   * Creates an instance from an array.
   * 
   * @param array - The array to deserialize from.
   * @param offset - Starting index in the array.
   * @returns A new instance.
   * @throws {RangeError} If the array doesn't have enough elements.
   */
  fromArray(array: TArray, offset?: number): T;

  /**
   * Creates an instance from an array, writing to an output instance.
   * 
   * @param array - The array to deserialize from.
   * @param offset - Starting index in the array.
   * @param out - The instance to write values to.
   * @returns The `out` instance with updated values.
   * @throws {RangeError} If the array doesn't have enough elements.
   */
  fromArray(array: TArray, offset: number, out: T): T;

  /**
   * Parses an instance from a string representation.
   * 
   * @param str - The string to parse.
   * @returns A new instance.
   * @throws {Error} If the string format is invalid.
   */
  parse?(str: string): T;

  /**
   * Parses an instance from a string, writing to an output instance.
   * 
   * @param str - The string to parse.
   * @param out - The instance to write values to.
   * @returns The `out` instance with updated values.
   * @throws {Error} If the string format is invalid.
   */
  parse?(str: string, out: T): T;

  /**
   * Creates a deep copy of an instance.
   * 
   * @param source - The instance to clone.
   * @returns A new instance with the same values.
   */
  clone(source: T): T;

  /**
   * Copies values from source to destination.
   * 
   * @param source - The instance to copy from.
   * @param dest - The instance to copy to.
   * @returns The `dest` instance with updated values.
   */
  copy(source: T, dest: T): T;
}
