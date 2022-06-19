import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TsGoogleDrive } from 'ts-google-drive';
import { File } from 'ts-google-drive/build/File';

const REFRESH_TOKEN = "1//04DaZrTQxk8rgCgYIARAAGAQSNwF-L9Ir0dLoG6wlGuufnL_dnelLEUEOuiCr_zbY3ASBWNofav81mjbYUMxvWtWZ_Kls0UA7ySg";
const ACCESS_TOKEN = "ya29.a0ARrdaM9yNdP9yvtIn37ta5EJ3SgQgIaz4t8o-u99dBv2ojEINOzA0383RKlkalwUhDSFwKHdEIqyFvwFcL0RX8CiDCAr5v3K0q1CCpgPSY4CQ2np_xQ7lXoJvR3VlhdriXVFOHcDpJh1devbE_6M7I7PaZzu";
const AUTHORIZATION = "4/0AX4XfWiHC4wQJxVtuwB7GwCSss1oX8ZC2gE3ZlWST2oSN5EBRCFgXrv35816GH1R4MBl8g";
const CLIENT_ID = "454551229984-h8j0u4545cr0nof3apcasq9ghrrgn787.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const MY_FIELDS = "id,kind,name,mimeType,parents,webViewLink,webContentLink,modifiedTime,createdTime,size";

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private tsGoogleDrive = new TsGoogleDrive({
    oAuthCredentials: { refresh_token: REFRESH_TOKEN },
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
