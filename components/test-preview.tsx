export function TestPreview() {
  return (
    <div className="rounded-md border p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Physics: Mechanics Fundamentals</h2>
        <p className="text-sm text-muted-foreground">10 Questions • Multiple Choice</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Question 1</h3>
          <p>
            Newton's First Law of Motion states that an object will remain at rest or in uniform motion in a straight
            line unless acted upon by:
          </p>
          <div className="pl-4 space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>External force</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Gravity only</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Friction only</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Magnetic fields</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Question 2</h3>
          <p>The SI unit of force is:</p>
          <div className="pl-4 space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Joule</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Newton</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Watt</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border"></div>
              <span>Pascal</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">Preview showing 2 of 10 questions</div>
      </div>
    </div>
  )
}

