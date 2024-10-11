import { action } from './_index';
import { PrismaClient } from '@prisma/client';
import { fetchTitle } from '~/utils';
import { encodeToShortCode } from '~/utils';

jest.mock('@prisma/client');
jest.mock('~/utils/fetchTitle');
jest.mock('~/utils/encodeToShortCode');

const prisma = new PrismaClient();

describe('URL Creation', () => {
  it('should create a short URL and store it in the database', async () => {
    const mockUrl = "https://example.com";
    const mockShortCode = "abc123";
    const mockTitle = "Example Domain";

    // Mock Prisma and other utility functions
    fetchTitle.mockResolvedValue(mockTitle);
    encodeToShortCode.mockReturnValue(mockShortCode);

    prisma.url.create.mockResolvedValue({ id: 1, original: mockUrl, shortCode: mockShortCode });
    prisma.url.update.mockResolvedValue({});

    const request = new Request("/", { method: 'POST', body: new URLSearchParams({ url: mockUrl }) });
    const response = await action({ request });

    expect(fetchTitle).toHaveBeenCalledWith(mockUrl);
    expect(prisma.url.create).toHaveBeenCalledWith(expect.objectContaining({ original: mockUrl }));
    expect(prisma.url.update).toHaveBeenCalledWith(expect.objectContaining({ shortCode: mockShortCode }));
    expect(response.status).toBe(302); // redirect after success
  });

  it('should reject an invalid URL', async () => {
    const invalidUrl = "invalid-url";
    const request = new Request("/", { method: 'POST', body: new URLSearchParams({ url: invalidUrl }) });

    await expect(action({ request })).rejects.toThrow("Invalid URL provided");
  });
});
