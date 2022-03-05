import sys
import pathlib

import ui
from editor import present_themed
#import pdbg

sys.path.append(str(pathlib.Path.cwd()) + '/pythonista-webview')
from wkwebview import WKWebView

uri = pathlib.Path('./docs/index.html')


class View(ui.View):
  def __init__(self, *args, **kwargs):
    ui.View.__init__(self, *args, **kwargs)
    self.wv = WKWebView()
    self.wv.load_url(str(uri))
    self.wv.flex = 'WH'
    self.wv.reload()
    self.add_subview(self.wv)
    
    self.set_close_btn()
    self.set_reload_btn()
    

  def layout(self):
    _x, _y, _w, _h = self.frame
    _, _, btn_w, btn_h = self.close_btn.frame
    self.close_btn.x = (_w * .92) - (btn_w / 2)
    self.close_btn.y = (_h * .064) - (btn_h / 2)
    #self.wv.height = self.height / 1.5

  def will_close(self):
    self.refresh_webview()
  
  
  def refresh_webview(self):
    self.wv.clear_cache()
    self.wv.reload()

  def set_close_btn(self):
    self.close_btn = self.create_btn('iob:ios7_close_32', False)
    self.close_btn.action = (lambda sender: self.close())
    self.add_subview(self.close_btn)

  def set_reload_btn(self):
    self.reload_btn = self.create_btn('iob:ios7_refresh_outline_32', True)
    self.reload_btn.action = (lambda sender: self.wv.reload())
    self.right_button_items = [self.reload_btn]

  def create_btn(self, icon, item=False):
    btn_icon = ui.Image.named(icon)
    _btn = ui.ButtonItem(image=btn_icon) if item else ui.Button(image=btn_icon)
    return _btn


if __name__ == '__main__':
  view = View()
  #view.present(style='panel', orientations=['portrait'])
  
  present_themed(
    view,
    theme_name='Theme09_Editorial',
    style='fullscreen',
    #style='panel',
    hide_title_bar=True,
    orientations=['portrait'])

