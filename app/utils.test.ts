import fetch from 'node-fetch';
import { fetchTitle } from '~/utils/fetchTitle';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('fetchTitle', () => {
  it('should fetch the title of a valid page', async () => {
    const mockHtml = "<html><head><title>Test Page</title></head></html>";
    fetch.mockResolvedValue(new Response(mockHtml));

    const title = await fetchTitle("https://example.com");
    expect(title).toBe("Test Page");
  });

  it('should return "No Title" when the page has no title tag', async () => {
    const mockHtml = "<html><head></head></html>";
    fetch.mockResolvedValue(new Response(mockHtml));

    const title = await fetchTitle("https://example.com");
    expect(title).toBe("No Title");
  });

  it('should return "Invalid URL" when the request fails', async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    const title = await fetchTitle("https://invalid-url.com");
    expect(title).toBe("Invalid URL");
  });
});
