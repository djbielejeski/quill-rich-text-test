import { Component } from '@angular/core';

export interface CustomTextModel {
  text: string;
  hyperlink?: string;
  isBold?: boolean;
  isUnderline?: boolean;
  isNewLine?: boolean;
  isBulletPoint?: boolean;
  isHyperLink?: boolean;
}

interface BulletsIndexModel {
  index: number;
  qtyAllowed: number;
  qtyUsed: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // When we get to an insert: "{anycontenthere}\n" (ie an insert with a newline at the end, that defines
  // the end of a chunk of data.  We can then parse everything we found before then into our separate objects
  // We can then work our way backwards from that \n to piece together all the other data

  dataModel = {
     ops: [
        {
          insert: "Test\nBullet 1"
        },
        {
          attributes: {
            list: "bullet"
          },
          insert: "\n\n"
        },
        {
          insert: "Bullet 2"
        },
        {
          attributes: {
            list: "bullet"
          },
          insert: "\n"
        },
        {
          insert: "Bullet With "
        },
        {
          attributes: {
            bold: true
          },
          insert: "Bold"
        },
        {
          attributes: {
            list: "bullet"
          },
          insert: "\n\n"
        },
        {
          attributes: {
            underline: true
          },
          insert: "Underline"
        },
        {
          insert: "\n"
        },
        {
          attributes: {
            link: "www.google.com"
          },
          insert: "Link"
        },
        {
          insert: "\n"
        },
        {
          attributes: {
            bold: true
          },
          insert: "Bold"
        },
        {
          insert: "\n"
        }
      ]
  };

  convertedDataModel: CustomTextModel[] = [];

  private usedBulletsIndex: BulletsIndexModel[] = [];

  convertBackToQuill() {
    this.convertDataModel();

    let response = [];

    for(let i = 0; i < this.convertedDataModel.length; i++) {
      let item = this.convertedDataModel[i];

      if (item.isBulletPoint) {
        // read the next (x) items as well, up to the next newline, and make a bullet point object out of it
        let nextIndexOfNewline = -1;
        for (let j = i + 2; j < this.convertedDataModel.length && nextIndexOfNewline == -1; j++) {
          if (this.convertedDataModel[j].isNewLine) {
            nextIndexOfNewline = j;
          }
        }

        // Now gather up the nodes between us

        // Skip the node that is holding the bulletPoint.
        i = i + 1;

        for (let currentBulletPointDataIndex = i; currentBulletPointDataIndex < nextIndexOfNewline; currentBulletPointDataIndex++) {
          let subItem = this.convertedDataModel[currentBulletPointDataIndex];

          if (subItem.text != '') {
            response.push(this.buildTextNode(subItem));
          }
        }

        response.push({
          insert: '\n',
          attributes: {
            list: 'bullet'
          }
        });

        i = nextIndexOfNewline;
      }
      else if (item.isNewLine) {
        response.push({insert: '\n'});
      }
      else {
        response.push(this.buildTextNode(item));
      }

    }

    this.dataModel = { ops: response };
  }

  private buildTextNode(item: CustomTextModel) {
    let response = {
      insert: item.text,
    }

    if (item.isBold || item.isHyperLink || item.isUnderline) {
      response['attributes'] = {};

      if (item.isHyperLink) {
        response['attributes']['link'] = item.hyperlink;
      }

      if (item.isUnderline) {
        response['attributes']['underline'] = true;
      }

      if (item.isBold) {
        response['attributes']['bold'] = true;
      }
    }

    return response;
  }


  convertDataModel() {


    // We need to parse all of the text based on \n
    // a \n signifies the end of operations applied to a specific item
    // Bullet points apply backwards
    /*
    Text output:
    - Bullet 1
    -

    Data
    {
      insert: 'Bullet 1'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n\n'
    },

    is equivalent to

    Text output:
    - Bullet 1
    -

    Data
    {
      insert: 'Bullet 1'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n'
    },
     */


    /*

    {
      insert: 'Test\n'
    },
    {
      insert: 'Bullet 1'
    },

    is equivalent to

    {
      insert: 'Test\nBullet 1'
    },

     */

    this.usedBulletsIndex = [];
    this.buildBulletIndex();

    this.convertedDataModel = [];
    const ops = this.dataModel.ops;
    let bulletTextNeedsToBeClosedOff = false;

    for(let i = 0; i < ops.length; i++) {
      let item = ops[i];

      let text = '' + item.insert;

      let textSplitOnNewlines = this.getTextSplitOnNewlines(text);


      for(let j = 0; j < textSplitOnNewlines.length; j++) {
        let subtext = textSplitOnNewlines[j];

        if (subtext == '') {
          let isBullet = item.attributes && item.attributes.list == 'bullet' ? true : false;

          if (isBullet) {
            if (bulletTextNeedsToBeClosedOff) {
              // Close off this bullet with a newline before drawing another bullet
              this.convertedDataModel.push({text: '', isNewLine: true});
              bulletTextNeedsToBeClosedOff = false;
            }

            let bulletIndex = this.usedBulletsIndex.find(x => x.index == i);
            let canApplyBullet = bulletIndex && bulletIndex.qtyUsed < bulletIndex.qtyAllowed;

            if (canApplyBullet) {
              this.convertedDataModel.push({text: '', isBulletPoint: true });
              // Push an empty text node in
              this.convertedDataModel.push({text: '' });

              // Push a newline in
              this.convertedDataModel.push({text: '', isNewLine: true});

              bulletIndex.qtyUsed++;
            }
          }
          else {
            this.convertedDataModel.push({text: '', isNewLine: true});
          }
        }
        else {
          let model: CustomTextModel = {
            text: subtext
          };

          if (item.attributes && item.attributes.bold) {
            model.isBold = true;
          }

          // Underline
          if (item.attributes && item.attributes.underline) {
            model.isUnderline = true;
          }

          // Hyperlink
          if (item.attributes && item.attributes.link) {
            model.hyperlink = item.attributes.link;
            model.isHyperLink = true;
          }

          // see if we are a bullet
          let isBullet = this.isNodeAfterMeFinalizingThisTextNodeAndIsBullet(i);

          if (isBullet && !bulletTextNeedsToBeClosedOff) {
            // find the next appropriate bullet index to use
            // get the first item where the index is greater than my index
            let bulletIndex = this.usedBulletsIndex.find(x => x.index > i);

            if (bulletIndex && bulletIndex.qtyUsed < bulletIndex.qtyAllowed) {
              bulletIndex.qtyUsed++;
              this.convertedDataModel.push({text: '', isBulletPoint: true});
              bulletTextNeedsToBeClosedOff = true;
            }
          }

          this.convertedDataModel.push(model);

          if (j < textSplitOnNewlines.length - 1) {
            this.convertedDataModel.push({ text: '', isNewLine: true });
          }
        }
      }
    }
  }

  private buildBulletIndex() {
    const ops = this.dataModel.ops;
    for(let i = 0; i < ops.length; i++) {
      let item = ops[i];
      if(item.attributes && item.attributes.list == 'bullet') {
        this.usedBulletsIndex.push({ index: i, qtyAllowed: item.insert.split('\n').length - 1, qtyUsed: 0 });
      }
    }
  }

  private isNodeAfterMeFinalizingThisTextNodeAndIsBullet(index): boolean {
    const ops = this.dataModel.ops;
    let response: boolean = false;

    for(let i = index; i < ops.length; i++) {
      let item = ops[i];

      if (item.insert.indexOf('\n') != -1) {
        response = item.attributes && item.attributes.list == 'bullet' ? true : false;
        i = ops.length;
      }
    }

    return response;
  }


  private getTextSplitOnNewlines(text): string[] {
    let response: string[] = [];

    let indexOfNewline = text.indexOf('\n');
    if (indexOfNewline == -1) {
      response.push(text);
    }
    else {
      let textSplitOnNewlines = text.split('\n');

      if (textSplitOnNewlines.length > text.length) {
        // This will be true if we are only made up of new lines
        // push as many newlines into the array as we have
        for(let i = 0; i < text.length; i++) {
          response.push('');
        }
      }
      else {
        textSplitOnNewlines.forEach((item) => {
          response.push(item);
        });
      }
    }

    return response;
  }
}
