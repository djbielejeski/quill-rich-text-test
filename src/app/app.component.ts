import { Component } from '@angular/core';

interface CustomTextModel {
  text: string;
  hyperlink?: string;
  isBold?: boolean;
  isUnderline?: boolean;
  isNewLine?: boolean;
  isBulletPoint?: boolean;
  isHyperLink?: boolean;
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
      insert: 'Test\nBullet 1'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n\n'
    },
    {
      insert: 'asbv'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n'
    },
    {
      insert: 'Bullet '
    },
    {
      attributes:
      {
        bold: true
      },
      insert: '2'
    },
    {
      attributes: { list: 'bullet' },
      insert: '\n\n'
    },
    {
      attributes:
        {
          link: 'www.google.com'
        },
      insert: 'Test'
    },
    {
      insert: '\n'
    },
    {
      attributes:
        {
          bold: true
        },
      insert: 'Bold'
    },
    {
      insert: '\n'
    },
    {
      attributes:
        {
          underline: true
        },
      insert: 'Underline'
    }]
  };


  get convertedDataModel(): CustomTextModel[] {
    let response: CustomTextModel[] = [];
    const ops = this.dataModel.ops;

    let endOfDeltaIndexes: number[] = [];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].insert.endsWith('\n')) {
        endOfDeltaIndexes.push(i);
      }
    }

    console.log(endOfDeltaIndexes);

    let startingIndex = 0;
    endOfDeltaIndexes.forEach((deltaIndex) => {

    });

    return response;
    /*
    let response: CustomTextModel[] = [];
    const ops = this.dataModel.ops;

    for(let i = 0; i < ops.length; i++) {
      let item = ops[i];

      if (item) {
        // Newline
        if (item.insert === '\n' && !item.attributes) {
          response.push({text: '', isNewLine: true});
        }
        else {

          // Bullet Points - These are weird, as the bullet comes AFTER the text node
          // Read ahead once, for the first bullet point
          let lookAheadIndex = i + 1;

          if (lookAheadIndex < ops.length &&
              ops[lookAheadIndex] &&
              ops[lookAheadIndex].attributes &&
              ops[lookAheadIndex].attributes.list == 'bullet') {

            response.push({text: '', isNewLine: true});

            // Insert our bullet point
            response.push({ text: '', isBulletPoint: true });

            // now get the content of the text node and put that after the bullet point
            this.getCustomModelForTextNode(item, response);

            // Skip past the next node (which is the bullet point)
            i++;
          }
          else {
            this.getCustomModelForTextNode(item, response);
          }
        }
      }
    };

    return response;*/
  }

  private getCustomModelForTextNode(item, response: CustomTextModel[]) {
    let textSplitOnNewlines = item.insert.split('\n');

    textSplitOnNewlines.forEach((text) => {
      if (text == '') {
        response.push({text: '', isNewLine: true});
      }
      else {
        let model: CustomTextModel = {
          text: text
        };

        // Bold
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

        response.push(model);
      }
    });
  }
}
