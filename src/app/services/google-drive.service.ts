import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TsGoogleDrive } from 'ts-google-drive';
import { File } from 'ts-google-drive/build/File';

const REFRESH_TOKEN = "1//04tzS8Hi_zOfUCgYIARAAGAQSNwF-L9Ir_5koRmSPbi7FTU26WQgi3T6vvKwq5_o4uqHOP9gGr9Is05AMwkfZqpiY6vYwOOgsVD4";
const ACCESS_TOKEN = "ya29.a0AWY7CkkBZ82LCbIWxOOirm1oTCDd7jQ9z1jwUFA75WtW4qnLb-FejObdOyw14FWVXWWwPLMeHQZ4TuoclQztsm5YnJaIjn1SyWiOQYbptijYF52M0g9BA2cyrIYwI_82IMVuVXyEdbeye8-nHhOeLJKF8g5daCgYKAegSARISFQG1tDrpeMjnOp52dZMT7gAnGV3-Jg0163";
const AUTHORIZATION = "4/0AbUR2VM5xJ2RXvjyYD7ggtLqLArKW3nKiE3SKcC5oWieJoB-WojEr0CyDkHR0lHhbQmIRA";
const CLIENT_ID = "454551229984-h8j0u4545cr0nof3apcasq9ghrrgn787.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const MY_FIELDS = "id,kind,name,mimeType,parents,webViewLink,webContentLink,modifiedTime,createdTime,size";

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
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
