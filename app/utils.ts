import fetch from "node-fetch";
import * as cheerio from "cheerio";
import nodeFetch from 'node-fetch';

export async function fetchTitle(url: string): Promise<string> {
    try {
      // Validate the URL before using it
      const validUrl = new URL(url); // This will throw an error if the URL is invalid
  
      const response = await nodeFetch(validUrl.toString());
      const text = await response.text();
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
  
      if (titleMatch) {
        return titleMatch[1];
      } else {
        return "No title found";
      }
    } catch (error) {
      console.error('Error fetching title:', error);
      return "Invalid URL"; // Gracefully handle invalid URLs
    }
  }

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function encodeToShortCode(id: number): string {
  let code = '';
  while (id > 0) {
    const remainder = id % ALPHABET.length;
    code = ALPHABET[remainder] + code;
    id = Math.floor(id / ALPHABET.length);
  }
  return code;
}
