import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TsGoogleDrive } from 'ts-google-drive';
import { File } from 'ts-google-drive/build/File';

const REFRESH_TOKEN = "1//04xE4gpnBcMniCgYIARAAGAQSNwF-L9IrJAX6wL09L3iS_kjWcUBBFwtoQ6ZFsUc-_-bs1_qc7vgP3q82v2-B4bjH-6URPzWEImk";
const ACCESS_TOKEN = "ya29.a0AWY7Ckk56OhHQAqgsmQnF0sdWLoRldG09bGhVPk1Q1bROWGMNDG3KE6Hee5kJq9sVc218JTeFm5octyL9SLgRHpQBwlI9i3dQEh07NsOjfd8ZVAsaOZTXTTd4Ye6pv2U-l7vNYYZU_1UfaI61XgCdyFWQfNxaCgYKAT0SARISFQG1tDrp97_PCbP5CRQLREcHLEfx6w0163";
const AUTHORIZATION = "4/0AbUR2VM5xJ2RXvjyYD7ggtLqLArKW3nKiE3SKcC5oWieJoB-WojEr0CyDkHR0lHhbQmIRA";
const CLIENT_ID = "454551229984-h8j0u4545cr0nof3apcasq9ghrrgn787.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const MY_FIELDS = "id,kind,name,mimeType,parents,webViewLink,webContentLink,modifiedTime,createdTime,size";

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  // private tsGoogleDrive = new TsGoogleDrive({
  //   // keyFile: "serviceAccount.json",
  //   // keyFilename: "serviceAccount.json",
  //   // keyFile: "focal-legacy-353517-e89c2400c75c.json",
  //   credentials: {
  //     type: "service_account",
  //     client_id: "109315623729959659191",
  //     token_url: "https://oauth2.googleapis.com/token",
  //     client_email: "gnykoua@focal-legacy-353517.iam.gserviceaccount.com",
  //     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn0SZMQHcJsxMK\nlfRLvRg5v42jYlvjjWzwq1yt521O6MnwMEPRZY83oSjQKKZLg5XNMPrN9/fRKOhY\naz9QsFW3k5ZAyH18cf8kVkrAAQ4AlnC8aL3eZi+MMpiZF3j4obBD8B+GcYraKETY\nPiOYWR8SLUBVYF+O+eGEbdbcrQQZiv7Qu/n6gQEYQsIGOlqratF3MLy/Pjg2lAtq\niMWX7DVj0CclP0rHr5o0nn8aSkOicDgvIS6yV2wYs/EQyNEgD5xSoc8RXnGIYgK0\nN2nw6IcAoFhBe5x5ZujgZ1uZ6F8ktEDDeornZueZpP1Av31UpQ03idM2Bfx3uiA/\nzw24lHWtAgMBAAECggEAE+uMY5TAtz1dz0M0N8v/FNZwwP+Amibu0t/5z7LJk4pS\nc4O8fnNTEsQQjNT7ww71jeEjLvvLm4pYOiv7h1/HF6lvNnVrX9rwRvyZ7Dyz0CIL\nc8dDHSPSv7jpyuextmG1rfrSOH/rKYY01dkFGfp06RAcs4W4Z3JbRgBRIZTFXc/5\naeYsUoXhu2vNnG7w4l/uEKUvY9k7ON7s80CP+0KL+EVk41Sdgg43dz7eBvEkCCLj\n+KdBR0RSuq5wRzFGNSD2IMfH2vqMtWslmfESkDzDDobKHExEcYSw/xTU69y/ha+J\npdaB/E5L3bIQTn9+uJ2Io699jSH3c0qs8Ns4+IjiiQKBgQDWUG3aw5nE7InKPR7b\nXXKvOZiKTojiYiv3qarQ2Ka5YUjFyGkSNT3XR1PnaUpW8y3ft9eeaUYCYh049WQw\nZCK6Y7h9UQhkwV1mnqmxoAWOm7Vxym1ieSEF8be0hRPm/SoeV3GPfKVMy6Q6PYYv\neTD4skAio0awrPVfZGYl75uDIwKBgQDIdW/xmnmqenmY+05wXXP2QcmZ7xNObt7W\nAz82ajLXEk00ilqBGbnd82xV/fGAOQCdR6808Dr264ge1cZtaCAy+4HQjXgsrU+V\nceRytLqVNjzRyQFYolxme5/g+eDihRKBBPDr4Tb4SOeTiov+dVJMKQ3jfm0YaiW8\nVMo66vtY7wKBgQCjCeLYt09G2W/ls+PCnG+/0AA0z5QhLPAn5CJ36SnFA7Z6CIGu\ngWR/Xtr8xEPyq+NtO43EDHBfJcb3au+CRNuKkoxqgXfyNoxYokGUSJmRqPE7FPVs\nIZw2ynGn2kmOw3AETx+sOfYC2zUfvWhUu0y/FdPmxfHkPGAa5uUy3PqgowKBgDsB\nbokkmmmXEZH5b1Zd+9Nh/BDGsd0lf4xpekLvMbXjGjy7+PYFd5OgoqQRUvQWU1r4\njdc8W27xV6kT7guoWcoIBGc6LUShY0qvMrqc/ksLow1xaGcJq78y5pXXl921pAO8\nS5pzObYN57SjVJ/7MtVeREtRnJVSMXdlUf3Ty1abAoGAZKBfxC0/+lutNQyqroDK\neuZRXYYa/OYJRkE0YSNTuazacFAPJP9g/QYv2mVWwcj2leFxNtc+boNBsbB2ede4\nps0k1DwD8MjZj1kfYt3lI1+Bgkf52hbjmu6dlNloHimb4gW13m3Li+weCw6E0fBZ\n6h9vhTjl4EDRIvhx9dIJBZ0=\n-----END PRIVATE KEY-----\n"
  //   }
  // });
  private tsGoogleDrive = new TsGoogleDrive({
    oAuthCredentials: {
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN,
    },
    oauthClientOptions: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    }
  });
  private mainFolderId = "1R0INux0odKs2VEDlyjIjkEw0HJQYGZj3";

  constructor(
    private _http: HttpClient
  ) { }

  listFolders() {
    return this.tsGoogleDrive
      .query()
      .setFolderOnly()
      .inFolder(this.mainFolderId)
      .run();
  }

  listFiles(folderId: string) {
    return this.tsGoogleDrive
      .query()
      .setFileOnly()
      .inFolder(folderId)
      .run();
  }

  getFile(fileId: string) {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    return new Promise<any>((resolve, reject) => {
      this._http.get(url, {
        headers: { "Authorization": "Bearer " + ACCESS_TOKEN },
        params: {
          fields: MY_FIELDS
        }
      }).subscribe({
        next: res => {
          resolve(res);
        },
        error: err => {
          console.log(err.message);

          reject(err.message);
        }
      });
    });
  }

  createFolder(folderName: string) {
    return this.tsGoogleDrive.createFolder({
      name: folderName,
      parent: this.mainFolderId,
    });
  }

  /**
   * 
   * @param folderId 
   * @param filename 
   * @param fileblob 
   * @param filemimetype 
   * @returns 
   */
  async uploadFile(folderId: string, filename: string, fileblob: Blob, filemimetype: string) {

    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const metadata = {
      name: filename,
      mimeType: filemimetype,
      parents: [folderId]
    }
    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append("file", fileblob);

    return new Promise<File | undefined>((resolve, reject) => {
      this._http.post(url, formData, {
        headers: { "Authorization": "Bearer " + ACCESS_TOKEN }
      }).subscribe({
        next: async (res: any) => {
          const file = await this.tsGoogleDrive.getFile(res.id);
          resolve(file);
        },
        error: err => {
          console.log(err.message);

          reject(err.message);
        }
      });
    });
  }

  downloadFile(file: File) {
    return file.download();
  }
}
