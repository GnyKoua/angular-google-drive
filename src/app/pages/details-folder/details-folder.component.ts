import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { GoogleDriveService } from 'src/app/services/google-drive.service';

@Component({
  selector: 'app-details-folder',
  templateUrl: './details-folder.component.html',
  styleUrls: ['./details-folder.component.scss']
})
export class DetailsFolderComponent implements OnInit {

  ListeFiles: any[] = [];
  Files: File[] = [];
  folderId: any;
  ActiveDocument: any;

  constructor(
    private _gdriveService: GoogleDriveService,
    private _activatedRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.folderId = this._activatedRoute.snapshot.params['id'];
    this.getFiles();
  }

  onFilesChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.Files.push(event.target.files[i]);
    }
  }

  onUpload() {
    this.Files.forEach(async file => {
      const blob = new Blob([await file.arrayBuffer()]);
      this._gdriveService.uploadFile(this.folderId, file.name, blob, file.type)
        .then((res) => {
          this.ListeFiles.push(res);
        });
    });
  }

  onDownload(file: any) {
    this._gdriveService.downloadFile(file).then(res => {
      this.ActiveDocument = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${file.mimeType};base64,${res.toString("base64")}`);
    });
    if (file.mimeType.indexOf("application/pdf") == -1 || file.mimeType.indexOf("image/") == -1) {
      $(function () {
        $('#viewDoc .close').trigger("click");
      });
    }
  }

  private readBase64(file: any): Promise<any> {
    var reader = new FileReader();
    var future = new Promise((resolve, reject) => {
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.addEventListener("error", function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(file);
    });
    return future;
  }

  private getFiles() {
    return new Promise((resolve, reject) => {
      this._gdriveService.listFiles(this.folderId).then(res => {
        this.ListeFiles = res;

        resolve(res);
      });
    });
  }

}
