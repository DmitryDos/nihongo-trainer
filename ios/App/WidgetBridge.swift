//
//  WidgetBridge.swift — Capacitor-плагин: приложение кладёт слова пресета «widget»
//  в общий App Group, откуда их читает домашний виджет. Плюс перезагружает виджет.
//

import Foundation
import Capacitor
import WidgetKit

@objc(WidgetBridge)
public class WidgetBridge: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridge"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "save", returnType: CAPPluginReturnPromise)
    ]

    static let appGroup = "group.com.dmdos.nihongo"

    @objc func save(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: WidgetBridge.appGroup) else {
            call.reject("App Group \(WidgetBridge.appGroup) недоступна — проверь capability на обоих таргетах")
            return
        }
        let words = call.getString("words") ?? "[]"
        defaults.set(words, forKey: "words")

        // Если список стал короче — сбросим индекс, чтобы не выйти за границы.
        if let data = words.data(using: .utf8),
           let arr = try? JSONSerialization.jsonObject(with: data) as? [Any] {
            let idx = defaults.integer(forKey: "index")
            if arr.isEmpty || idx >= arr.count {
                defaults.set(0, forKey: "index")
            }
        }

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }
}
