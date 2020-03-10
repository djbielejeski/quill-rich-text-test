import {TestBed, ComponentFixture} from '@angular/core/testing';

import {AppComponent, CustomTextModel} from './app.component';
import {FormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {isNewline} from 'codelyzer/angular/styles/cssLexer';

describe('app.component', () => {
  let component: AppComponent;
  let fixture:   ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        QuillModule.forRoot()
      ],
      declarations: [ AppComponent ],
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance; // BannerComponent test instance
  });

  let defaultProperties = (): CustomTextModel => {
    return {
      text: '',
      isNewLine: undefined,
      isUnderline: undefined,
      isHyperLink: undefined,
      isBold: undefined,
      hyperlink: undefined,
      isBulletPoint: undefined
    }
  }

  let assertAllProperties = (actualList: CustomTextModel[], expectedList: CustomTextModel[]) => {

    expect(actualList.length).toBe(expectedList.length);

    if(actualList.length != expectedList.length) {
      console.error('Actual: ', actualList);
      console.error('Expected: ', expectedList);
    }

    for(let i = 0; i < actualList.length; i++) {
      let actual = actualList[i];
      let expected = expectedList[i];

      expect(actual.text).toBe(expected.text);
      expect(actual.isNewLine).toBe(expected.isNewLine);
      expect(actual.isUnderline).toBe(expected.isUnderline);
      expect(actual.isHyperLink).toBe(expected.isHyperLink);
      expect(actual.isBold).toBe(expected.isBold);
      expect(actual.hyperlink).toBe(expected.hyperlink);
      expect(actual.isBulletPoint).toBe(expected.isBulletPoint);
    }
  }

  describe( 'Basic tests', () => {
    describe('Text', () => {
      it('(1) line of basic text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            text: 'Test'
          }
        ];


        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });

      it('(3) lines of basic text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              insert: 'Test\nTest\nTest'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            text: 'Test'
          }
        ];

        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });
    });

    describe( 'Bold tests', () => {
      it('(1) line of bold text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                bold: true
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isBold: true,
            text: 'Test'
          }
        ];


        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });

      it('(3) lines of bold text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                bold: true
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                bold: true
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                bold: true
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isBold: true,
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isBold: true,
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isBold: true,
            text: 'Test'
          }
        ];

        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });
    });

    describe( 'Underline tests', () => {
      it('(1) line of underline text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                underline: true
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isUnderline: true,
            text: 'Test'
          }
        ];


        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });

      it('(3) lines of underline text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                underline: true
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                underline: true
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                underline: true
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isUnderline: true,
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isUnderline: true,
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isUnderline: true,
            text: 'Test'
          }
        ];

        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });
    });

    describe( 'Hyperlink tests', () => {
      it('(1) line of hyperlink text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                link: 'www.google.com'
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isHyperLink: true,
            hyperlink: 'www.google.com',
            text: 'Test'
          }
        ];


        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });

      it('(3) lines of hyperlink text',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              attributes: {
                link: 'www.google.com'
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                link: 'www.google.com'
              },
              insert: 'Test'
            },
            {
              insert: '\n'
            },
            {
              attributes: {
                link: 'www.google.com'
              },
              insert: 'Test'
            }
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isHyperLink: true,
            hyperlink: 'www.google.com',
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isHyperLink: true,
            hyperlink: 'www.google.com',
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true
          },
          {
            ...defaultProperties(),
            isHyperLink: true,
            hyperlink: 'www.google.com',
            text: 'Test'
          }
        ];

        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });
    });

    describe( 'Bullet tests', () => {
      it('(1) bullet',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              insert: 'Test'
            },
            {
              attributes: {
                list: "bullet"
              },
              insert: "\n"
            },
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isBulletPoint: true,
          },
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true,
          }
        ];


        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });

      it('(3) bullets',() => {
        // Arrange
        component.dataModel = {
          ops: [
            {
              insert: 'Test'
            },
            {
              attributes: {
                list: "bullet"
              },
              insert: "\n"
            },
            {
              insert: 'Test'
            },
            {
              attributes: {
                list: "bullet"
              },
              insert: "\n"
            },
            {
              insert: 'Test'
            },
            {
              attributes: {
                list: "bullet"
              },
              insert: "\n"
            },
          ]
        };

        let expectedList: CustomTextModel[] = [
          {
            ...defaultProperties(),
            isBulletPoint: true,
          },
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true,
          },
          {
            ...defaultProperties(),
            isBulletPoint: true,
          },
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true,
          },
          {
            ...defaultProperties(),
            isBulletPoint: true,
          },
          {
            ...defaultProperties(),
            text: 'Test'
          },
          {
            ...defaultProperties(),
            isNewLine: true,
          }
        ];

        // Act
        component.convertDataModel();


        // Assert
        assertAllProperties(component.convertedDataModel, expectedList);
      });
    });

  });

  describe('Complicated tests', () => {
    it('All types on 1 line', () => {
      // Arrange
      component.dataModel = {
        ops: [
          {
            attributes: {
              bold: true
            },
            insert: 'T'
          },
          {
            attributes: {
              underline: true
            },
            insert: 'e'
          },
          {
            attributes: {
              link: 'www.google.com'
            },
            insert: 's'
          },
          {
            insert: 't\n\n\n'
          },
        ]
      };

      let expectedList: CustomTextModel[] = [
        {
          ...defaultProperties(),
          isBold: true,
          text: 'T'
        },
        {
          ...defaultProperties(),
          isUnderline: true,
          text: 'e'
        },
        {
          ...defaultProperties(),
          isHyperLink: true,
          hyperlink: 'www.google.com',
          text: 's'
        },
        {
          ...defaultProperties(),
          text: 't'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        }
        ,
        {
          ...defaultProperties(),
          isNewLine: true
        }
        ,
        {
          ...defaultProperties(),
          isNewLine: true
        }
      ];

      // Act
      component.convertDataModel();


      // Assert
      assertAllProperties(component.convertedDataModel, expectedList);
    });

    fit('All types on 1 line', () => {
      // Arrange
      component.dataModel = {
        ops: [
          {
            insert: 'Test\nBullet 1'
          },
          {
            attributes: {
              list: 'bullet'
            },
            insert: '\n\n'
          },
          {
            insert: 'Bullet 2'
          },
          {
            attributes: {
              list: 'bullet'
            },
            insert: '\n'
          },
          {
            insert: 'Bullet With '
          },
          {
            attributes: {
              bold: true
            },
            insert: 'Bold'
          },
          {
            attributes: {
              list: 'bullet'
            },
            insert: '\n\n'
          },
          {
            attributes: {
              underline: true
            },
            insert: 'Underline'
          },
          {
            insert: '\n'
          },
          {
            attributes: {
              link: 'www.google.com'
            },
            insert: 'Link'
          },
          {
            insert: '\n'
          },
          {
            attributes: {
              bold: true
            },
            insert: 'Bold'
          },
          {
            insert: '\n'
          }
        ]
      };

      let expectedList: CustomTextModel[] = [
        {
          ...defaultProperties(),
          text: 'Test'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBulletPoint: true
        },
        {
          ...defaultProperties(),
          text: 'Bullet 1'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBulletPoint: true
        },
        {
          ...defaultProperties(),
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBulletPoint: true
        },
        {
          ...defaultProperties(),
          text: 'Bullet 2'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBulletPoint: true
        },
        {
          ...defaultProperties(),
          text: 'Bullet With '
        },
        {
          ...defaultProperties(),
          isBold: true,
          text: 'Bold'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBulletPoint: true
        },
        {
          ...defaultProperties(),
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isUnderline: true,
          text: 'Underline'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isHyperLink: true,
          hyperlink: 'www.google.com',
          text: 'Link'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        },
        {
          ...defaultProperties(),
          isBold: true,
          text: 'Bold'
        },
        {
          ...defaultProperties(),
          isNewLine: true
        }
      ];

      // Act
      component.convertDataModel();


      // Assert
      assertAllProperties(component.convertedDataModel, expectedList);
    });
  });
});
