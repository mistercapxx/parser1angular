import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';

import * as asn1js from 'asn1js';
import {AttributeTypeAndValue, Certificate} from "pkijs";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxFileDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    if (!files || !files[0]) return;

    const file = files[0].fileEntry as FileSystemFileEntry;
    file.file(x => {
      const reader = new FileReader();

      reader.onload = () => {
        const certificateData = reader.result as ArrayBuffer;
        this.parseCertificate(certificateData);
      };

      reader.readAsArrayBuffer(x);
    });

  }

  parseCertificate(certificateData: ArrayBuffer): void {

    const certificateBuffer = new Uint8Array(certificateData);

    try {

      const asn1 = asn1js.fromBER(certificateBuffer.buffer);
      const certificate = new Certificate({ schema: asn1.result });



      console.log('Issuer:',this.typesAndValuesToString(certificate.issuer.typesAndValues));
      console.log('Subject:',this.typesAndValuesToString(certificate.subject.typesAndValues));

      console.log('Valid from:', certificate.notBefore.value.toLocaleDateString());
      console.log('Valid To:', certificate.notAfter.value.toLocaleDateString());
    } catch (error) {
      console.error('Error parsing certificate:', error);
    }
  }

  private typesAndValuesToString(types:AttributeTypeAndValue []) {
   return types.map(attr =>
      `${attr.type} = ${attr.value.valueBlock.value}`
    ).join();
  }
  public fileOver(event:any){
    console.log(event);
  }

  public fileLeave(event:any){
    console.log(event);
  }

}
