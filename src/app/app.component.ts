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
      insert: 'Test\n'
    },
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
      insert: 'Link'
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

  private usedBulletsIndex: number[] = [];

  convertBackToQuill() {
    let currentModel = this.convertedDataModel;

    let response = [];


    this.dataModel = { ops: response };
  }


  get convertedDataModel(): CustomTextModel[] {

    this.usedBulletsIndex = [];

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

    console.info('---------- Staring parsing ----------');

    let response: CustomTextModel[] = [];
    const ops = this.dataModel.ops;


    let appliedBulletForLine: boolean = false;
    for(let i = 0; i < ops.length; i++) {
      let item = ops[i];

      let text = '' + item.insert;

      let textSplitOnNewlines = this.getTextSplitOnNewlines(text);

      console.log(textSplitOnNewlines);


      for(let j = 0; j < textSplitOnNewlines.length; j++) {
        let subtext = textSplitOnNewlines[j];

        if (subtext == '') {
          let isBullet = item.attributes && item.attributes.list == 'bullet' ? true : false;
          let bulletNotAppliedBackwards = this.usedBulletsIndex.indexOf(i) == -1;

          if (isBullet && bulletNotAppliedBackwards) {
            response.push({text: '', isBulletPoint: true });
            // Push an empty text node in
            response.push({text: '' });
          }

          // Push the newline
          response.push({text: '', isNewLine: true });

          appliedBulletForLine = false;
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

          if (isBullet && !appliedBulletForLine) {
            appliedBulletForLine = true;

            response.push({text: '', isBulletPoint: true });
          }

          response.push(model);
        }
      }
    }


    return response;
  }

  private isNodeAfterMeFinalizingThisTextNodeAndIsBullet(index): boolean {
    const ops = this.dataModel.ops;
    let response: boolean = false;

    for(let i = index; i < ops.length; i++) {
      let item = ops[i];

      if (item.insert.endsWith('\n')) {
        response = item.attributes && item.attributes.list == 'bullet' ? true : false;

        if(response) {
          this.usedBulletsIndex.push(i);
        }

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
      let textWithoutNewline = text.substr(0, indexOfNewline);
      if (textWithoutNewline) {
        response.push(textWithoutNewline);
      }

      text = text.substr(textWithoutNewline + 2, text.length - (textWithoutNewline + 2));

      if (text.indexOf('\n') != -1) {
        response.push(...this.getTextSplitOnNewlines(text));
      }
      else {
        // this is for the ending newline that this line has.
        response.push('');
      }
    }

    return response;
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
